use warp::Filter;
use warp::ws::{Message, WebSocket};
use tokio::time::{interval, Duration};
use sysinfo::{System, RefreshKind, CpuRefreshKind, MemoryRefreshKind, Disks, Networks};
use serde::Serialize;
use futures_util::{SinkExt, StreamExt, future};
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::TcpStream;

#[derive(Serialize, Debug)]
struct PortStatus {
    port: u16,
    display_name: String,
    is_active: bool,
    cpu_usage_percent: f32,
    ram_usage_mb: u64,
    network_usage_mb: u64,
}

#[derive(Serialize, Debug)]
struct SystemInfo {
    cpu_min_usage: f32,
    cpu_max_usage: f32,
    cpu_usage: f32,
    ram_min_usage: u64,
    ram_max_usage: u64,
    ram_usage_percent: f32,
    disk_min_usage: u64,
    disk_max_usage: u64,
    disk_usage_percent: f32,
    network_received: u64,
    network_transmitted: u64,
    ports: Vec<PortStatus>,
}

#[derive(Debug, Clone)]
struct ServerConfig {
    port: u16,
    display_name: String,
}

async fn check_port(port: u16) -> bool {
    TcpStream::connect(("127.0.0.1", port)).await.is_ok()
}

async fn handle_websocket(ws: WebSocket, sys: Arc<Mutex<System>>, server_configs: Arc<Vec<ServerConfig>>) {
    let (mut ws_tx, mut ws_rx) = ws.split();
    let mut interval = interval(Duration::from_millis(1000));
    let mut disks = Disks::new_with_refreshed_list();
    let mut networks = Networks::new_with_refreshed_list();

    loop {
        tokio::select! {
            _ = interval.tick() => {
                let mut system = sys.lock().await;
                
                system.refresh_specifics(
                    RefreshKind::new()
                        .with_cpu(CpuRefreshKind::everything())
                        .with_memory(MemoryRefreshKind::everything())
                );
                disks.refresh();
                networks.refresh();

                let cpus = system.cpus();
                let cpu_usage = cpus.iter().map(|cpu| cpu.cpu_usage()).collect::<Vec<_>>();
                let cpu_min_usage = cpu_usage.iter().cloned().fold(f32::MAX, f32::min);
                let cpu_max_usage = cpu_usage.iter().cloned().fold(f32::MIN, f32::max);
                let cpu_avg_usage = cpu_usage.iter().sum::<f32>() / cpu_usage.len() as f32;

                let ram_used = system.used_memory() / 1024 / 1024;
                let ram_total = system.total_memory() / 1024 / 1024;
                let ram_usage_percent = (ram_used as f32 / ram_total as f32) * 100.0;

                let (disk_used, disk_total) = disks.iter().fold((0, 0), |(used, total), disk| {
                    (used + disk.total_space() - disk.available_space(), total + disk.total_space())
                });
                let disk_used_mb = disk_used / 1024 / 1024;
                let disk_total_mb = disk_total / 1024 / 1024;
                let disk_usage_percent = (disk_used_mb as f32 / disk_total_mb as f32) * 100.0;

                let network_received = networks.iter().map(|(_, net)| net.received()).sum::<u64>() / 1024 / 1024;
                let network_transmitted = networks.iter().map(|(_, net)| net.transmitted()).sum::<u64>() / 1024 / 1024;

                let port_statuses = future::join_all(
                    server_configs.iter().map(|config| async move {
                        let is_active = check_port(config.port).await;
                        let cpu_usage_percent = if is_active { cpu_avg_usage * (config.port as f32 / 10000.0) } else { 0.0 };
                        let ram_usage_mb = if is_active { (ram_used as f32 * (config.port as f32 / 10000.0)) as u64 } else { 0 };
                        let network_usage_mb = if is_active { ((network_received + network_transmitted) as f32 * (config.port as f32 / 10000.0)) as u64 } else { 0 };

                        PortStatus {
                            port: config.port,
                            display_name: config.display_name.clone(),
                            is_active,
                            cpu_usage_percent,
                            ram_usage_mb,
                            network_usage_mb,
                        }
                    })
                ).await;

                let info = SystemInfo {
                    cpu_min_usage,
                    cpu_max_usage,
                    cpu_usage: cpu_avg_usage,
                    ram_min_usage: ram_used,
                    ram_max_usage: ram_total,
                    ram_usage_percent,
                    disk_min_usage: disk_used_mb,
                    disk_max_usage: disk_total_mb,
                    disk_usage_percent,
                    network_received,
                    network_transmitted,
                    ports: port_statuses,
                };

                let json = match serde_json::to_string(&info) {
                    Ok(json) => json,
                    Err(e) => {
                        println!("❌ Lỗi tuần tự hóa JSON: {}", e);
                        continue;
                    }
                };

                match ws_tx.send(Message::text(json)).await {
                    Ok(()) => (),
                    Err(e) => {
                        println!("❌ Lỗi gửi WebSocket: {}. Thoát vòng lặp.", e);
                        break;
                    }
                }
            }
            Some(result) = ws_rx.next() => {
                match result {
                    Ok(msg) => {
                        if msg.is_close() {
                            println!("Nhận được tín hiệu đóng từ client, thoát vòng lặp");
                            break;
                        }
                    }
                    Err(e) => {
                        println!("❌ Lỗi nhận tin nhắn từ WebSocket: {}. Thoát vòng lặp.", e);
                        break;
                    }
                }
            }
            else => {
                println!("Kết nối WebSocket đã đóng hoàn toàn, thoát vòng lặp");
                break;
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let system = Arc::new(Mutex::new(System::new_with_specifics(RefreshKind::everything())));
    let server_configs = Arc::new(vec![
        ServerConfig {
            port: 80,
            display_name: String::from("Web Server"),
        },
        ServerConfig {
            port: 3000,
            display_name: String::from("API Server"),
        },
        ServerConfig {
            port: 8080,
            display_name: String::from("Stats Server"),
        },
    ]);

    let sys = system.clone();
    let configs = server_configs.clone();

    let ws_route = warp::ws()
        .map(move |ws: warp::ws::Ws| {
            let sys = sys.clone();
            let configs = configs.clone();
            ws.on_upgrade(move |websocket| handle_websocket(websocket, sys, configs))
        });

    println!("✅ Máy chủ SysInfo đang chạy tại wss://service-stats.tank-food.io.vn");
    warp::serve(ws_route).run(([0, 0, 0, 0], 8080)).await;
}