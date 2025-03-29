import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix lỗi icon Leaflet không hiển thị trên React
// import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Định nghĩa kiểu dữ liệu cho vị trí
interface Position {
  lat: number;
  lng: number;
}

// Định nghĩa kiểu dữ liệu cho props của MapPicker
interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Tạo icon tùy chỉnh cho Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41], // Thêm để tránh cảnh báo
});

// Component con để xử lý sự kiện chọn vị trí trên bản đồ
const LocationMarker: React.FC<{
  position: Position | null;
  setPosition: React.Dispatch<React.SetStateAction<Position | null>>;
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e: any) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

// Component chính
const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          onLocationSelect(latitude, longitude);
        },
        (error) => {
          console.error("Không thể lấy vị trí:", error.message);
          // Nếu lỗi, đặt vị trí mặc định là Hồ Chí Minh
          setPosition({ lat: 10.762622, lng: 106.660172 });
        }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation.");
      setPosition({ lat: 10.762622, lng: 106.660172 });
    }
  }, []);

  if (!position) {
    return <p>Đang lấy vị trí hiện tại...</p>;
  }

  return (
    <MapContainer
      center={position ? [position.lat, position.lng] : [10.762622, 106.660172]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default MapPicker;
