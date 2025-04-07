import asyncio
import websockets
import json
import psutil
import socket
from collections import deque
import time

class PortStatus:
    def __init__(self, port, display_name, is_active, cpu_usage_percent, ram_usage_mb, network_usage_mb):
        self.port = port
        self.display_name = display_name
        self.is_active = is_active
        self.cpu_usage_percent = cpu_usage_percent
        self.ram_usage_mb = ram_usage_mb
        self.network_usage_mb = network_usage_mb

    def to_json(self):
        return {
            "port": self.port,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "cpu_usage_percent": self.cpu_usage_percent,
            "ram_usage_mb": self.ram_usage_mb,
            "network_usage_mb": self.network_usage_mb
        }

class SystemInfo:
    def __init__(self, cpu_min_usage, cpu_max_usage, cpu_usage, ram_min_usage, ram_max_usage, ram_usage_percent, disk_min_usage, disk_max_usage, disk_usage_percent, network_received, network_transmitted, ports):
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

    def to_json(self):
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
            "ports": [port.to_json() for port in self.ports]
        }

class ServerConfig:
    def __init__(self, port, display_name):
        self.port = port
        self.display_name = display_name

async def check_port(port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(("127.0.0.1", port))
        sock.close()
        return result == 0
    except:
        return False

async def handle_websocket(websocket, sys, server_configs):
    disks = psutil.disk_usage('/')
    network_counters = psutil.net_io_counters()
    while True:
        await asyncio.sleep(1)

        cpu_usage = psutil.cpu_percent(percpu=True)
        cpu_min_usage = min(cpu_usage)
        cpu_max_usage = max(cpu_usage)
        cpu_avg_usage = sum(cpu_usage) / len(cpu_usage)

        ram = psutil.virtual_memory()
        ram_used = ram.used // 1024 // 1024
        ram_total = ram.total // 1024 // 1024
        ram_usage_percent = ram.percent

        disks = psutil.disk_usage('/')
        disk_used_mb = disks.used // 1024 // 1024
        disk_total_mb = disks.total // 1024 // 1024
        disk_usage_percent = disks.percent

        network_counters = psutil.net_io_counters()
        network_received = network_counters.bytes_recv // 1024 // 1024
        network_transmitted = network_counters.bytes_sent // 1024 // 1024

        port_statuses = []
        for config in server_configs:
            is_active = await check_port(config.port)
            port_statuses.append((config.port, config.display_name, is_active))

        active_ports_count = sum(1 for _, _, is_active in port_statuses if is_active)
        active_ports_count = 1 if active_ports_count == 0 else active_ports_count

        port_statuses = [
            PortStatus(
                port,
                display_name,
                is_active,
                cpu_avg_usage / active_ports_count if is_active else 0.0,
                ram_used // active_ports_count if is_active else 0,
                (network_received + network_transmitted) // active_ports_count if is_active else 0
            )
            for port, display_name, is_active in port_statuses
        ]

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
            await websocket.send(json.dumps(info.to_json()))
        except Exception as e:
            print(f"❌ Lỗi gửi WebSocket: {e}. Có thể client đã ngắt kết nối.")
            break

async def ws_handler(websocket):
    system = {}
    server_configs = [
        ServerConfig(80, "Web Server"),
        ServerConfig(3000, "API Server"),
        ServerConfig(8080, "Stats Server"),
    ]
    try:
        await handle_websocket(websocket, system, server_configs)
    except (websockets.exceptions.InvalidMessage, EOFError, ConnectionResetError):
        pass
    except Exception as e:
        print(f"❌ Lỗi không mong đợi: {e}")

async def main():
    server = await websockets.serve(ws_handler, "0.0.0.0", 8080)
    print("✅ Máy chủ SysInfo đang chạy tại wss://service-stats.tank-food.io.vn")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())