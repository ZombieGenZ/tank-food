import asyncio
import websockets
import json
import psutil
import socket
from collections import deque
import time

class PortStatus:
    def __init__(self, port, is_active):
        self.port = port
        self.is_active = is_active

    def to_json(self):
        return {"port": self.port, "is_active": self.is_active}

class SystemInfo:
    def __init__(self, cpu_min_usage, cpu_max_usage, cpu_usage, ram_min_usage, ram_max_usage, ram_usage_percent, disk_min_usage, disk_max_usage, disk_usage_percent, ports):
        self.cpu_min_usage = cpu_min_usage
        self.cpu_max_usage = cpu_max_usage
        self.cpu_usage = cpu_usage
        self.ram_min_usage = ram_min_usage
        self.ram_max_usage = ram_max_usage
        self.ram_usage_percent = ram_usage_percent
        self.disk_min_usage = disk_min_usage
        self.disk_max_usage = disk_max_usage
        self.disk_usage_percent = disk_usage_percent
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
            "ports": [port.to_json() for port in self.ports]
        }

async def check_port(port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(("127.0.0.1", port))
        sock.close()
        return result == 0
    except:
        return False

async def handle_websocket(websocket, ports_to_check):
    while True:
        await asyncio.sleep(1)

        cpu_usage = psutil.cpu_percent(percpu=True)
        cpu_min_usage = min(cpu_usage)
        cpu_max_usage = max(cpu_usage)
        cpu_avg_usage = sum(cpu_usage) / len(cpu_usage)

        ram = psutil.virtual_memory()
        ram_used = ram.used // 1024
        ram_total = ram.total // 1024
        ram_usage_percent = ram.percent

        disk = psutil.disk_usage('/')
        disk_used_mb = disk.used // 1024 // 1024
        disk_total_mb = disk.total // 1024 // 1024
        disk_usage_percent = disk.percent

        port_statuses = []
        for port in ports_to_check:
            is_active = await check_port(port)
            port_statuses.append(PortStatus(port, is_active))

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
            port_statuses
        )

        try:
            await websocket.send(json.dumps(info.to_json()))
        except Exception as e:
            print(f"❌ Lỗi gửi WebSocket: {e}")
            break

async def main():
    ports_to_check = [80, 3000, 8080]
    async with websockets.serve(lambda ws: handle_websocket(ws, ports_to_check), "0.0.0.0", 8080):
        print("✅ Máy chủ SysInfo đang chạy tại wss://service-stats.tank-food.io.vn")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())