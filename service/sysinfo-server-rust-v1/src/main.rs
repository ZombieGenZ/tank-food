use warp::Filter;
use warp::ws::{Message, WebSocket};
use tokio::time::{self, Duration};
use sysinfo::{System, RefreshKind, CpuRefreshKind, Disks};
use serde::Serialize;
use futures_util::{SinkExt, StreamExt, future};
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::TcpStream;

#[derive(Serialize, Debug)]
struct PortStatus {
    port: u16,
    is_active: bool,
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
    ports: Vec<PortStatus>,
}

async fn check_port(port: u16) -> bool {
    TcpStream::connect(("127.0.0.1", port)).await.is_ok()
}

async fn handle_websocket(ws: WebSocket, sys: Arc<Mutex<System>>, ports_to_check: Arc<Vec<u16>>) {
    let (mut ws_tx, _ws_rx) = ws.split();
    let mut interval = time::interval(Duration::from_millis(1000));

    loop {
        interval.tick().await;

        let mut system = sys.lock().await;
        (*system).refresh_cpu_specifics(CpuRefreshKind::everything());
        (*system).refresh_memory();
        (*system).refresh_all();

        let cpus = (*system).cpus();
        let cpu_usage = cpus.iter().map(|cpu| cpu.cpu_usage()).collect::<Vec<_>>();
        let cpu_min_usage = cpu_usage.iter().cloned().fold(f32::MAX, f32::min);
        let cpu_max_usage = cpu_usage.iter().cloned().fold(f32::MIN, f32::max);
        let cpu_avg_usage = cpu_usage.iter().sum::<f32>() / cpu_usage.len() as f32;

        let ram_used = (*system).used_memory() / 1024;
        let ram_total = (*system).total_memory() / 1024;
        let ram_usage_percent = (ram_used as f32 / ram_total as f32) * 100.0;

        let disks = Disks::new_with_refreshed_list();
        let (disk_used, disk_total) = disks.iter().fold((0, 0), |(used, total), disk| {
            (
                used + disk.total_space() - disk.available_space(),
                total + disk.total_space(),
            )
        });
        let disk_used_mb = disk_used / 1024 / 1024;
        let disk_total_mb = disk_total / 1024 / 1024;
        let disk_usage_percent = (disk_used_mb as f32 / disk_total_mb as f32) * 100.0;

        let port_statuses = future::join_all(
            ports_to_check.iter().map(|&port| async move {
                PortStatus {
                    port,
                    is_active: check_port(port).await,
                }
            }),
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
            ports: port_statuses,
        };

        let json = match serde_json::to_string(&info) {
            Ok(json) => json,
            Err(e) => {
                eprintln!("❌ JSON serialization error: {}", e);
                continue;
            }
        };

        if let Err(e) = ws_tx.send(Message::text(json)).await {
            eprintln!("❌ WebSocket send error: {}", e);
            break;
        }
    }
}

#[tokio::main]
async fn main() {
    let refresh_kind = RefreshKind::everything();
    let system = Arc::new(Mutex::new(System::new_with_specifics(refresh_kind)));
    let ports_to_check = Arc::new(vec![80, 3000, 8080]);

    let sys = system.clone();
    let ports = ports_to_check.clone();

    let ws_route = warp::path("stats")
        .and(warp::ws())
        .map(move |ws: warp::ws::Ws| {
            let sys = sys.clone();
            let ports = ports.clone();
            ws.on_upgrade(move |websocket| handle_websocket(websocket, sys, ports))
        });

    println!("✅ Máy chủ WebSocket đang chạy tại ws://localhost:8080/stats");
    warp::serve(ws_route).run(([127, 0, 0, 1], 8080)).await;
}