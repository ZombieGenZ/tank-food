import asyncio
import json
import psutil
import socket
from dataclasses import dataclass
from typing import List
import websockets
from websockets.server import WebSocketServerProtocol

@dataclass
class TrangThaiCong:
    cong: int
    hoat_dong: bool

    def thanh_dict(self):
        return {"port": self.cong, "is_active": self.hoat_dong}

@dataclass
class ThongTinHeThong:
    cpu_su_dung_toi_thieu: float
    cpu_su_dung_toi_da: float
    cpu_su_dung: float
    ram_su_dung_toi_thieu: int
    ram_su_dung_toi_da: int
    ram_phan_tram_su_dung: float
    dia_su_dung_toi_thieu: int
    dia_su_dung_toi_da: int
    dia_phan_tram_su_dung: float
    cac_cong: List[TrangThaiCong]

    def thanh_dict(self):
        return {
            "cpu_min_usage": self.cpu_su_dung_toi_thieu,
            "cpu_max_usage": self.cpu_su_dung_toi_da,
            "cpu_usage": self.cpu_su_dung,
            "ram_min_usage": self.ram_su_dung_toi_thieu,
            "ram_max_usage": self.ram_su_dung_toi_da,
            "ram_usage_percent": self.ram_phan_tram_su_dung,
            "disk_min_usage": self.dia_su_dung_toi_thieu,
            "disk_max_usage": self.dia_su_dung_toi_da,
            "disk_usage_percent": self.dia_phan_tram_su_dung,
            "ports": [cong.thanh_dict() for cong in self.cac_cong]
        }

async def kiem_tra_cong(cong: int) -> bool:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        ket_qua = sock.connect_ex(('127.0.0.1', cong))
        sock.close()
        return ket_qua == 0
    except Exception:
        return False

async def xu_ly_websocket(websocket: WebSocketServerProtocol):
    cac_cong_can_kiem_tra = [80, 3000, 8080]
    
    while True:
        try:
            cpu_phan_tram = psutil.cpu_percent(percpu=True)
            cpu_su_dung_toi_thieu = min(cpu_phan_tram)
            cpu_su_dung_toi_da = max(cpu_phan_tram)
            cpu_su_dung_trung_binh = sum(cpu_phan_tram) / len(cpu_phan_tram)

            bo_nho = psutil.virtual_memory()
            ram_da_dung = bo_nho.used // (1024 * 1024)
            ram_tong = bo_nho.total // (1024 * 1024)
            ram_phan_tram_su_dung = bo_nho.percent

            dia = psutil.disk_usage('/')
            dia_da_dung_mb = (dia.total - dia.free) // (1024 * 1024)
            dia_tong_mb = dia.total // (1024 * 1024)
            dia_phan_tram_su_dung = dia.percent

            trang_thai_cong = [
                TrangThaiCong(cong=cong, hoat_dong=await kiem_tra_cong(cong))
                for cong in cac_cong_can_kiem_tra
            ]

            thong_tin = ThongTinHeThong(
                cpu_su_dung_toi_thieu=cpu_su_dung_toi_thieu,
                cpu_su_dung_toi_da=cpu_su_dung_toi_da,
                cpu_su_dung=cpu_su_dung_trung_binh,
                ram_su_dung_toi_thieu=ram_da_dung,
                ram_su_dung_toi_da=ram_tong,
                ram_phan_tram_su_dung=ram_phan_tram_su_dung,
                dia_su_dung_toi_thieu=dia_da_dung_mb,
                dia_su_dung_toi_da=dia_tong_mb,
                dia_phan_tram_su_dung=dia_phan_tram_su_dung,
                cac_cong=trang_thai_cong
            )

            await websocket.send(json.dumps(thong_tin.thanh_dict()))
            
            await asyncio.sleep(1)

        except Exception as e:
            print(f"❌ Lỗi: {e}")
            break

async def chinh():
    async with websockets.serve(xu_ly_websocket, "localhost", 8080):
        print("✅ Máy chủ WebSocket đang chạy tại wss://service-stats.tank-food.io.vn/stats")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(chinh())