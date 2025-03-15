import { JSX, useState, useEffect } from "react";

const ContactUs = (): JSX.Element => {
    const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
        latitude: null,
        longitude: null,
      });
      const [error, setError] = useState<string | null>(null);
      const [address, setAddress] = useState<string | null>(null);
    
      useEffect(() => {
        // Kiểm tra trình duyệt có hỗ trợ Geolocation API không
        if (navigator.geolocation) {
          // Lấy vị trí hiện tại của người dùng
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Lấy vĩ độ và kinh độ
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });

              getAddressFromCoordinates(latitude, longitude);
            },
            (error) => {
              // Xử lý lỗi nếu có
              setError(error.message);
            }
          );
        } else {
          setError('Trình duyệt của bạn không hỗ trợ Geolocation API.');
        }
      }, []);

      const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
    
          // Lấy địa chỉ từ kết quả API
          if (data.display_name) {
            console.log(data)
            setAddress(data.display_name);
          } else {
            setError('Không thể lấy địa chỉ từ vị trí hiện tại.');
          }
        } catch (error) {
          setError(`Lỗi khi lấy địa chỉ từ API: ${error}`);
        }
      };
    
      return (
        <div className="location-container">
          <h1>Vị trí của bạn</h1>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {location.latitude && location.longitude ? (
                <div className="location-info">
                  <p>
                    <strong>Vĩ độ:</strong> {location.latitude}
                  </p>
                  <p>
                    <strong>Kinh độ:</strong> {location.longitude}
                  </p>
                </div>
              ) : (
                <p>Đang lấy vị trí...</p>
              )}
              {address ? (
                <p>
                  <strong>Địa chỉ:</strong> {address}
                </p>
              ) : (
                <p>Đang lấy địa chỉ...</p>
              )}
            </>
          )}
        </div>
      );
}

export default ContactUs