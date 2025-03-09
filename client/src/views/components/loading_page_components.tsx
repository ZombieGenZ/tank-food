import { Spin } from "antd";

function Loading() {
    return(
        <>
            <Spin tip="loading..." fullscreen />
        </>
    )
}

export default Loading;