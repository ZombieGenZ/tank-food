import { Spin } from "antd";

function Loading() {
    return(
        <>
            <Spin size="large" tip="loading... 🚚💨📦" fullscreen />
        </>
    )
}

export default Loading;