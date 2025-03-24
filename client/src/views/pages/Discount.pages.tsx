import { JSX, useState, useEffect } from "react";

const DiscountCodeManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

    useEffect(() => {
        const body = {
            language: null,
            refresh_token: refresh_token,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
        })
    }, [refresh_token, access_token])

    useEffect(() => {
        const handleStorageChange = () => {
          setRefreshToken(localStorage.getItem("refresh_token"));
          setAccessToken(localStorage.getItem("access_token"));
        };
      
        window.addEventListener("storage", handleStorageChange);
      
        return () => {
          window.removeEventListener("storage", handleStorageChange);
        };
      }, []);
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="w-4/5 bg-[#FFF4E6] p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex items-start">
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý mã giảm giá" : "Discount code management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    
                </div>
            </div>
        </div>
    )
}

export default DiscountCodeManagement;