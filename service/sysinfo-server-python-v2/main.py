import asyncio
import json
import psutil
import websockets
from dataclasses import dataclass
from typing import List, Dict, Any
from aiohttp import web

@dataclass
class ServerConfig:
    port: int
    display_name: str

class PortStatus:
    def __init__(self, port: int, display_name: str, is_active: bool, cpu_usage_percent: float, ram_usage_mb: int, network_usage_mb: int):
        self.port = port
        self.display_name = display_name
        self.is_active = is_active
        self.cpu_usage_percent = cpu_usage_percent
        self.ram_usage_mb = ram_usage_mb
        self.network_usage_mb = network_usage_mb
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "port": self.port,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "cpu_usage_percent": self.cpu_usage_percent,
            "ram_usage_mb": self.ram_usage_mb,
            "network_usage_mb": self.network_usage_mb
        }

class SystemInfo:
    def __init__(self, cpu_min_usage: float, cpu_max_usage: float, cpu_usage: float,
                 ram_min_usage: int, ram_max_usage: int, ram_usage_percent: float,
                 disk_min_usage: int, disk_max_usage: int, disk_usage_percent: float,
                 network_received: int, network_transmitted: int, ports: List[PortStatus]):
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
    
    def to_dict(self) -> Dict[str, Any]:
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

async def check_port(port: int) -> bool:
    try:
        reader, writer = await asyncio.open_connection('127.0.0.1', port)
        writer.close()
        await writer.wait_closed()
        return True
    except:
        return False

async def websocket_handler(request):
    server_configs = [
        ServerConfig(port=80, display_name="Web Server"),
        ServerConfig(port=3000, display_name="API Server"),
        ServerConfig(port=8080, display_name="Stats Server")
    ]
    
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    
    print("✅ WebSocket kết nối đã được thiết lập")
    
    try:
        network_io_last = psutil.net_io_counters()
        
        while True:
            cpu_percentages = psutil.cpu_percent(interval=None, percpu=True)
            if not cpu_percentages:
                cpu_percentages = [0.0]
                
            cpu_min_usage = min(cpu_percentages)
            cpu_max_usage = max(cpu_percentages)
            cpu_avg_usage = sum(cpu_percentages) / len(cpu_percentages)
            
            memory = psutil.virtual_memory()
            ram_used = memory.used // (1024 * 1024)
            ram_total = memory.total // (1024 * 1024)
            ram_usage_percent = memory.percent
            
            disk_info = psutil.disk_usage('/')
            disk_used_mb = disk_info.used // (1024 * 1024)
            disk_total_mb = disk_info.total // (1024 * 1024)
            disk_usage_percent = disk_info.percent
            
            network_io = psutil.net_io_counters()
            network_received = network_io.bytes_recv // (1024 * 1024)
            network_transmitted = network_io.bytes_sent // (1024 * 1024)
            

            port_statuses = []
            for config in server_configs:
                is_active = await check_port(config.port)
                port_statuses.append((config.port, config.display_name, is_active))
            
            active_ports_count = sum(1 for _, _, is_active in port_statuses if is_active)
            active_ports_count = max(1, active_ports_count)
            
            port_status_objects = []
            for port, display_name, is_active in port_statuses:
                port_status = PortStatus(
                    port=port,
                    display_name=display_name,
                    is_active=is_active,
                    cpu_usage_percent=cpu_avg_usage / active_ports_count if is_active else 0.0,
                    ram_usage_mb=ram_used // active_ports_count if is_active else 0,
                    network_usage_mb=(network_received + network_transmitted) // active_ports_count if is_active else 0
                )
                port_status_objects.append(port_status)
            
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
                ports=port_status_objects
            )
            
            try:
                json_data = json.dumps(info.to_dict())
                await ws.send_str(json_data)
            except Exception as e:
                print(f"❌ Lỗi gửi dữ liệu JSON: {e}")
                break
            
            await asyncio.sleep(1)
    except Exception as e:
        print(f"❌ Lỗi trong quá trình xử lý WebSocket: {e}")
    finally:
        return ws

async def main():
    app = web.Application()
    app.router.add_get('/stats', websocket_handler)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', 8080)
    
    print("✅ Máy chủ WebSocket đang chạy tại wss://service-stats.tank-food.io.vn/stats")
    await site.start()
    
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())