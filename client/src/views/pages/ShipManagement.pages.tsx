import { JSX } from "react";

const ShipManagement = (): JSX.Element => {
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="w-4/5 bg-[#FFF4E6] p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex items-start">
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý giao hàng" : "Delivery management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    
                </div>
            </div>
        </div>
    )
}

export default ShipManagement;