import asyncio
import websockets
import json
import psutil

class PortStatus:
    def __init__(self, port, display_name, is_active, cpu_usage_percent, ram_usage_mb, network_usage_mb):
        self.port = port
        self.display_name = display_name
        self.is_active = is_active
        self.cpu_usage_percent = cpu_usage_percent
        self.ram_usage_mb = ram_usage_mb
        self.network_usage_mb = network_usage_mb

    def to_dict(self):
        return {
            "port": self.port,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "cpu_usage_percent": self.cpu_usage_percent,
            "ram_usage_mb": self.ram_usage_mb,
            "network_usage_mb": self.network_usage_mb
        }

class SystemInfo:
    def __init__(self, cpu_min_usage, cpu_max_usage, cpu_usage, ram_min_usage, ram_max_usage, ram_usage_percent,
                 disk_min_usage, disk_max_usage, disk_usage_percent, network_received, network_transmitted, ports):
        self.cpu_min_usage = cpu_min_usage
        self.cpu_max_usage = cpu_max_usage
        self.cpu_usage = cpu_usage
        self.ram_min_usage = ram_min_usage
        self.ram_max_usage = ram_max_usage
        self.ram_usage_percent = ram_usage_percent
        self.disk_min_usage = disk_min_usage
        self.disk_max_usage = disk_max_usage
        self.disk_usage_percent = disk_usage_percent
        self.network_received = network_received
        self.network_transmitted = network_transmitted
        self.ports = ports

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

class ServerConfig:
    def __init__(self, port, display_name):
        self.port = port
        self.display_name = display_name

async def check_port(port):
    try:
        reader, writer = await asyncio.open_connection("127.0.0.1", port)
        writer.close()
        await writer.wait_closed()
        return True
    except:
        return False

async def handle_websocket(websocket, server_configs):
    while True:
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

        net_io = psutil.net_io_counters()
        network_received = net_io.bytes_recv // 1024 // 1024
        network_transmitted = net_io.bytes_sent // 1024 // 1024

        port_statuses = []
        for config in server_configs:
            is_active = await check_port(config.port)
            cpu_usage_percent = cpu_avg_usage * (config.port / 10000.0) if is_active else 0.0
            ram_usage_mb = int(ram_used * (config.port / 10000.0)) if is_active else 0
            network_usage_mb = int((network_received + network_transmitted) * (config.port / 10000.0)) if is_active else 0

            port_statuses.append(PortStatus(
                config.port,
                config.display_name,
                is_active,
                cpu_usage_percent,
                ram_usage_mb,
                network_usage_mb
            ))

        info = SystemInfo(
            cpu_min_usage,
            cpu_max_usage,
            cpu_avg_usage,
            ram_used,
            ram_total,
            ram_usage_percent,
            disk_used_mb,
            disk_total_mb,
            disk_usage_percent,
            network_received,
            network_transmitted,
            port_statuses
        )

        try:
            json_data = json.dumps(info.to_dict())
        except Exception as e:
            print(f"❌ Lỗi tuần tự hóa JSON: {e}")
            continue

        try:
            await websocket.send(json_data)
        except Exception as e:
            print(f"❌ Lỗi gửi WebSocket: {e}. Thoát vòng lặp.")
            break

        try:
            await asyncio.sleep(1)
            message = await asyncio.wait_for(websocket.recv(), timeout=0.1)
            if not message:
                print("Nhận được tín hiệu đóng từ client, thoát vòng lặp")
                break
        except asyncio.TimeoutError:
            pass
        except Exception as e:
            print(f"❌ Lỗi nhận tin nhắn từ WebSocket: {e}. Thoát vòng lặp.")
            break

async def handler(websocket):
    server_configs = [
        ServerConfig(80, "Web Server"),
        ServerConfig(3000, "API Server"),
        ServerConfig(8080, "Stats Server"),
    ]
    await handle_websocket(websocket, server_configs)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print("✅ Máy chủ SysInfo đang chạy tại wss://service-stats.tank-food.io.vn")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())