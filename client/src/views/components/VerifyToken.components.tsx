import { RESPONSE_CODE } from "../../constants/responseCode.constants";

const Verify = async (refresh_token: string|null, access_token: string|null): Promise<boolean> => {
    const body = {
        language: null,
        refresh_token: refresh_token
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-token`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("Lỗi khi gọi API:", response.status);
            return false;
        }

        const data = await response.json();
        console.log("Dữ liệu nhận được:", data);
        
        // Kiểm tra phản hồi từ server để xác thực
        return data.code == RESPONSE_CODE.TOKEN_VERIFICATION_SUCCESSFUL;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return false;
    }
};

export default Verify;