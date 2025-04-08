import asyncio
import json
from dataclasses import dataclass
import psutil
import websockets
from aiohttp import ClientSession

@dataclass
class PortStatus:
    port: int
    display_name: str
    is_active: bool
    cpu_usage_percent: float
    ram_usage_mb: int
    network_usage_mb: int

    def to_dict(self):
        return {
            "port": self.port,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "cpu_usage_percent": self.cpu_usage_percent,
            "ram_usage_mb": self.ram_usage_mb,
            "network_usage_mb": self.network_usage_mb
        }

@dataclass
class SystemInfo:
    cpu_min_usage: float
    cpu_max_usage: float
    cpu_usage: float
    ram_min_usage: int
    ram_max_usage: int
    ram_usage_percent: float
    disk_min_usage: int
    disk_max_usage: int
    disk_usage_percent: float
    network_received: int
    network_transmitted: int
    ports: list

    def to_dict(self):
        return {
            "cpu_min_usage": self.cpu_min_usage,
            "cpu_max_usage": self.cpu_max_usage,
            "cpu_usage": self.cpu_usage,
            "ram_min_usage": self.ram_min_usage,
            "ram_max_usage": self.ram_max_usage,
            "ram_usage_percent": self.ram_usage_percent,
            "disk_min_usage": self.disk_min_usage,
            "disk_max_usage": self.disk_max_usage,
            "disk_usage_percent": self.disk_usage_percent,
            "network_received": self.network_received,
            "network_transmitted": self.network_transmitted,
            "ports": [port.to_dict() for port in self.ports]
        }

@dataclass
class ServerConfig:
    port: int
    display_name: str

async def check_port(port):
    try:
        reader, writer = await asyncio.open_connection("127.0.0.1", port)
        writer.close()
        await writer.wait_closed()
        return True
    except:
        return False

async def handle_websocket(websocket, server_configs):
    print("✅ Đã thiết lập kết nối WebSocket với client")
    async with ClientSession() as session:
        while True:
            try:
                cpu_usage = psutil.cpu_percent(percpu=True)
                cpu_min_usage = min(cpu_usage)
                cpu_max_usage = max(cpu_usage)
                cpu_avg_usage = sum(cpu_usage) / len(cpu_usage)

                ram = psutil.virtual_memory()
                ram_used = ram.used // 1024 // 1024
                ram_total = ram.total // 1024 // 1024
                ram_usage_percent = ram.percent

                disk = psutil.disk_usage('/')
                disk_used_mb = disk.used // 1024 // 1024
                disk_total_mb = disk.total // 1024 // 1024
                disk_usage_percent = disk.percent

                net = psutil.net_io_counters()
                network_received = net.bytes_recv // 1024 // 1024
                network_transmitted = net.bytes_sent // 1024 // 1024

                port_statuses = []
                for config in server_configs:
                    is_active = await check_port(config.port)
                    cpu_usage_percent = cpu_avg_usage * (config.port / 10000.0) if is_active else 0.0
                    ram_usage_mb = ram_used * (config.port // 10000) if is_active else 0
                    network_usage_mb = (network_received + network_transmitted) * (config.port // 10000) if is_active else 0

                    port_statuses.append(PortStatus(
                        port=config.port,
                        display_name=config.display_name,
                        is_active=is_active,
                        cpu_usage_percent=cpu_usage_percent,
                        ram_usage_mb=ram_usage_mb,
                        network_usage_mb=network_usage_mb
                    ))

                info = SystemInfo(
                    cpu_min_usage=cpu_min_usage,
                    cpu_max_usage=cpu_max_usage,
                    cpu_usage=cpu_avg_usage,
                    ram_min_usage=ram_used,
                    ram_max_usage=ram_total,
                    ram_usage_percent=ram_usage_percent,
                    disk_min_usage=disk_used_mb,
                    disk_max_usage=disk_total_mb,
                    disk_usage_percent=disk_usage_percent,
                    network_received=network_received,
                    network_transmitted=network_transmitted,
                    ports=port_statuses
                )

                await websocket.send(json.dumps(info.to_dict()))
                await asyncio.sleep(1)

            except websockets.ConnectionClosed:
                print("Kết nối WebSocket đã đóng hoàn toàn, thoát vòng lặp")
                break
            except Exception as e:
                print(f"Lỗi trong quá trình xử lý: {e}")
                break

async def main():
    server_configs = [
        ServerConfig(port=80, display_name="Web Server"),
        ServerConfig(port=3000, display_name="API Server"),
        ServerConfig(port=8080, display_name="Stats Server"),
    ]

    async def websocket_handler(websocket):
        try:
            await handle_websocket(websocket, server_configs)
        except websockets.exceptions.InvalidMessage:
            print("❌ Client gửi yêu cầu không hợp lệ, bỏ qua kết nối")
        except websockets.ConnectionClosed:
            print("❌ Kết nối bị đóng trước khi hoàn tất handshake")
        except EOFError:
            print("❌ Không nhận được dữ liệu từ client, kết nối bị ngắt")
        except Exception as e:
            print(f"❌ Lỗi trong quá trình xử lý kết nối: {e}")

    print("✅ Máy chủ SysInfo đang chạy tại wss://service-stats.tank-food.io.vn")
    try:
        server = await websockets.serve(
            websocket_handler,
            "0.0.0.0",
            8080,
            ping_interval=20,
            ping_timeout=20
        )
        await server.wait_closed()
    except Exception as e:
        print(f"❌ Lỗi khi khởi động server: {e}")

if __name__ == "__main__":
    asyncio.run(main())