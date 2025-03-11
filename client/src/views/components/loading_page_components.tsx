import { Spin } from "antd";

const Loading = () => {
    return(
        <>
            <Spin 
                size="large"   
                tip="loading... 🚚💨📦" 
                fullscreen />
        </>
    )
}

export default Loading;