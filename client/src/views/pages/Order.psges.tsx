import { JSX, useState, useEffect } from "react";
import { Table, Input, Button ,message ,Modal } from 'antd';
import type { TableProps, GetProps } from 'antd';
import { RESPONSE_CODE } from "../../constants/responseCode.constants";

interface DataType {
    key: string;
    id: string,
    name: string,
    total_price: number,
    date: string,
    status: string,
    delivery_type: number | null,
    cancellation_reason: string | null;
    payment_status: number,
    payment: string,
    local?: string | null,
}

interface Order {
    _id: string;
    canceled_at: string;
    canceled_by: string | null;
    cancellation_reason: string | null;
    completed_at: string;
    confirmmed_at: string;
    created_at: string;
    delivered_at: string;
    delivering_at: string;
    delivery_address: string | null;
    delivery_latitude: number | null;
    delivery_longitude: number | null;
    delivery_nation: string | null;
    delivery_type: number | null;
    discount_code: string | null;
    distance: number | null;
    email: string | null;
    estimated_time: string | null;
    fee: number;
    is_first_transaction: boolean;
    moderated_by: string;
    name: string | null;
    node: string;
    order_status: number;
    payment_status: number;
    payment_type: number;
    phone: string | null;
    product: Product[];
    receiving_address: string | null;
    receiving_latitude: number | null;
    receiving_longitude: number | null;
    receiving_nation: string | null;
    shipper: string | null;
    suggested_route: string | null;
    total_bill: number;
    total_price: number;
    total_quantity: number;
    updated_at: string;
    user: string | null;
    vat: number;
  }

interface Product {
    availability: string;
    category: Category;
    created_at: string;
    description_translate_1: string;
    description_translate_1_language: string;
    description_translate_2: string;
    description_translate_2_language: string;
    preview: Preview;
    price: string;
    product_id: string;
    quantity: number;
    title_translate_1: string;
    title_translate_1_language: string;
    title_translate_2: string;
    title_translate_2_language: string;
    updated_at: string;
    _id: string;
}

interface Category {
    category_name_translate_1: string;
    category_name_translate_2: string;
    created_at: string;
    index: number;
    translate_1_language: string;
    translate_2_language: string;
    updated_at: string;
    _id: string;
}

interface Preview {
    path: string;
    size: number;
    type: string;
    url: string;
}

const OrderManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [waitData, setWaitData] = useState<Order[]>([])
    const [doneData, setDoneData] = useState<Order[]>([])
    const [waitView, setWaitView] = useState<DataType[]>([])
    const [doneView, setDoneView] = useState<DataType[]>([])
    const [messageApi, contextHolder] = message.useMessage();

    const [showreasonmodal, setShowreasonmodal] = useState<boolean>(false);
    const [selectID, setSelectID] = useState<string|null>(null)
    const [reasonRejection, setReason] = useState<string>("")

    const [showCancelmodal, setShowcancelmodal] = useState<boolean>(false);
    const [reasonCancelation, setReasonCancel] = useState<string>("")

    const showModalReject = (orderID: string) => {
        setShowreasonmodal(true)
        setSelectID(orderID)
    }

    const showModalCancel = (orderID: string) => {
        setShowcancelmodal(true)
        setSelectID(orderID)
    }

    const handleConfirm = (orderID: string) => {
        const body = {
            language: null,
            refresh_token: refresh_token,
            order_id: orderID            
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-completion-confirmation`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code) {
                messageApi.success(data.message)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setWaitData(data.order)
                    console.log(data)
                })
    
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setDoneData(data.order)
                    console.log(data)
                })
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
    }

    const handleCancel = (orderID: string) => {
        if(!orderID) {
            messageApi.error("Mã id không hợp lệ")
            return;
        }

        const body = {
            language: null,
            refresh_token: refresh_token,
            order_id: orderID,
            reason: reasonCancelation,
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/cancel-order-employee`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL){
                setShowcancelmodal(false)
                messageApi.success(data.message)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setWaitData(data.order)
                    console.log(data)
                })
    
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setDoneData(data.order)
                    console.log(data)
                })
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
    }

    const handleReject = (orderID: string) => {
        if(!orderID) {
            messageApi.error("Mã id không hợp lệ")
            return;
        }

        const body = {
            language: null,
            refresh_token: refresh_token,
            order_id: orderID,
            decision: false,
            reason: reasonRejection,
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-approval`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL){
                messageApi.success(data.message)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setWaitData(data.order)
                    console.log(data)
                })

                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setDoneData(data.order)
                    console.log(data)
                })
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
    }

    const handleConfirmPayment = (orderId : string) => {
        console.log(orderId)
        const body = {
            language: null,
            refresh_token: refresh_token,
            order_id: orderId,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/payment-confirmation`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == RESPONSE_CODE.PAYMENT_CONFIRMATION_SUCCESSFUL) {
                messageApi.success("Xác nhận thanh toán thành công")
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setWaitData(data.order)
                    console.log(data)
                })

                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setDoneData(data.order)
                    console.log(data)
                })
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
    };

    const handleAccpet = (orderId: string) => {
        const body = {
            language: null,
            refresh_token: refresh_token,
            order_id: orderId,
            decision: true,
            reason: null
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-approval`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL){
                messageApi.success(data.message)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setWaitData(data.order)
                    console.log(data)
                })

                fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    return response.json()
                }).then((data) => {
                    setDoneData(data.order)
                    console.log(data)
                })
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
    }

    useEffect(() => {
        const body = {
            language: null,
            refresh_token: refresh_token,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            setWaitData(data.order)
            console.log(data)
        })

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            setDoneData(data.order)
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

    useEffect(() => {
        if (!Array.isArray(waitData)) {
            console.error("waitData is not an array:", waitData);
            return;
        }

        const newWaitView: DataType[] = waitData.map((bill, index) => {
            // const IOString = bill.created_at;
            // const date = new Date(IOString);
            return({
                key: String(index + 1),
                id: bill._id,
                name: bill.product.map((bills) => {
                    return `${language() == "Tiếng Việt" ? bills.title_translate_1 : bills.title_translate_2},`
                }),
                total_price: bill.total_bill,
                cancellation_reason: bill.cancellation_reason ? bill.cancellation_reason : null,
                date: bill.created_at,
                payment_status: bill.payment_status,
                delivery_type: bill.delivery_type,
                status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                        bill.order_status === 1 ? "Duyệt thành công" : 
                        bill.order_status === 2 ? "Đang giao" : 
                        bill.order_status === 3 ? "Giao đơn thành công" : 
                        bill.order_status === 4 ? "Thành công" : "Thất bại",
                payment: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                        bill.payment_status === 1 ? "Thành công" : "Thất bại",
                local: bill.receiving_address ? bill.receiving_address : "Tại quầy",
        })})

        const newDoneView: DataType[] = doneData.map((bill, index) => {
            // const IOString = bill.created_at;
            // const date = new Date(IOString);
            // `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
            return ({
                key: String(index + 1),
                id: bill._id,
                name: bill.product.map((bills) => `${language() == "Tiếng Việt" ? bills.title_translate_1 : bills.title_translate_2}, `),
                total_price: bill.total_bill,
                cancellation_reason: bill.cancellation_reason ? bill.cancellation_reason : null,
                date: bill.created_at,
                payment_status: bill.payment_status,
                delivery_type: bill.delivery_type,
                status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                        bill.order_status === 1 ? "Duyệt thành công" : 
                        bill.order_status === 2 ? "Đang giao" : 
                        bill.order_status === 3 ? "Giao đơn thành công" : 
                        bill.order_status === 4 ? "Thành công" : "Thất bại",
                payment: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                        bill.payment_status === 1 ? "Thành công" : "Thất bại",
                local: bill.receiving_address ? bill.receiving_address : "Tại quầy",
        })})

        setWaitView(newWaitView)
        setDoneView(newDoneView)
    }, [waitData, doneData])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Đang chờ duyệt":
                return "#f0ad4e"; // Màu cam
            case "Đang chờ thanh toán":
                return "#f0ad4e"
            case "Đang giao":
                return "#5bc0de"; // Màu xanh dương
            case "Thành công":
                return "#5cb85c";
            case "Duyệt thành công":
                return "#5cb85c";
            case "Giao đơn thành công":
                return "#5cb85c";
            case "Thất bại":
                return "#d9534f"; // Màu đỏ
            default:
                return "#777"; // Màu xám cho trạng thái không xác định
        }
    };

    const getPaymentColor = (payment: string) => {
        switch (payment) {
            case "Thành công":
                return "#5cb85c"; // Xanh lá
            case "Thất bại":
                return "#d9534f"; // Đỏ
            case "Đang chờ thanh toán":
                return "#f0ad4e"
            default:
                return "#777"; // Xám
        }
    };

    const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Đơn hàng',
          dataIndex: 'name',
          key: 'name',
          width: 350,
          render: (text) => <p className="font-bold">{text}</p>,
        },
        {
          title: 'Tổng tiền đơn hàng',
          dataIndex: 'total_price',
          width: 350,
          key: 'total_price',
        },
        {
          title: 'Thời gian đặt hàng',
          dataIndex: 'date',
          width: 350,
          key: 'date',
        },
        {
            title: 'Trạng thái đơn hàng',
            key: 'status',
            dataIndex: 'status',
            width: 350,
            render: (status) => (
                <span 
                    style={{
                        backgroundColor: getStatusColor(status),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        display: "inline-block",
                        textAlign: "center",
                        minWidth: "120px",
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Trạng thái thanh toán',
            key: 'payment',
            dataIndex: 'payment',
            width: 350,
            render: (payment) => (
                <span 
                    style={{
                        backgroundColor: getPaymentColor(payment),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        display: "inline-block",
                        textAlign: "center",
                        minWidth: "120px",
                    }}
                >
                    {payment}
                </span>
            ),
        },
        {
            title: 'Địa chỉ giao hàng',
            key: 'local',
            dataIndex: 'local',
            width: 350,
        },
        {
            title: '',
            width: 150,
            render: (_text, record) => {
                return (
                    <div className="flex gap-2 flex-col">
                    {(record.payment_status === 0 && record.delivery_type === 0) && (
                      <Button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2" onClick={() => handleConfirmPayment(record.id)}>
                        ✅ {language() === "Tiếng Việt" ? "Xác nhận thanh toán" : "Payment confirm"}
                      </Button>
                    )}
                    {(record.delivery_type === 1 || record.payment_status === 1) && (
                      <Button className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2" onClick={() => handleAccpet(record.id)}>
                        📦 {language() === "Tiếng Việt" ? "Duyệt" : "Accept"}
                      </Button>
                    )}
                    <Button className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2" onClick={() => showModalReject(record.id)}>
                      ❌ {language() === "Tiếng Việt" ? "Từ chối" : "Refuse"}
                    </Button>
                  </div>
                )
            },
        }
      ];

      const columnsAccept: TableProps<DataType>['columns'] = [
        {
          title: 'Đơn hàng',
          dataIndex: 'name',
          key: 'name',
          width: 350,
          render: (text) => <p className="font-bold">{text}</p>,
        },
        {
          title: 'Tổng tiền đơn hàng',
          dataIndex: 'total_price',
          width: 350,
          key: 'total_price',
        },
        {
          title: 'Thời gian đặt hàng',
          dataIndex: 'date',
          width: 350,
          key: 'date',
        },
        {
            title: 'Trạng thái đơn hàng',
            key: 'status',
            dataIndex: 'status',
            width: 350,
            render: (status) => (
                <span 
                    style={{
                        backgroundColor: getStatusColor(status),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        display: "inline-block",
                        textAlign: "center",
                        minWidth: "120px",
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Trạng thái thanh toán',
            key: 'payment',
            dataIndex: 'payment',
            width: 350,
            render: (payment) => (
                <span 
                    style={{
                        backgroundColor: getPaymentColor(payment),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        display: "inline-block",
                        textAlign: "center",
                        minWidth: "120px",
                    }}
                >
                    {payment}
                </span>
            ),
        },
        {
            title: 'Địa chỉ giao hàng',
            key: 'local',
            dataIndex: 'local',
            width: 350,
        },
        {
            title: '',
            width: 350,
            render: (_text, record) => {
                if(record.status == "Thành công") {
                    return <p className="text-green-600 font-bold">Xác nhận đơn hàng thành công</p>;
                } else if (record.cancellation_reason === "") {
                    return (
                        <div className="flex gap-2">
                            {record.delivery_type === 0 && (
                                <Button 
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
                                    onClick={() => handleConfirm(record.id)}
                                >
                                    ✅ {language() === "Tiếng Việt" ? "Xác nhận thành công" : "Accept confirm"}
                                </Button>
                            )}
                            <Button 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => showModalCancel(record.id)}
                            >
                                ❌ {language() === "Tiếng Việt" ? "Huỷ" : "Cancel"}
                            </Button>
                        </div>
                    );
                } 
                return <p className="text-red-500 font-bold">Đơn hàng đã bị huỷ</p>;
            },
        }
      ];
      

      const WaitTable: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={waitView} pagination={{ pageSize: 25 }}/>;
      const DoneTable: React.FC = () => <Table<DataType> className="w-full" columns={columnsAccept} dataSource={doneView} pagination={{ pageSize: 25 }}/>;
      type SearchProps = GetProps<typeof Input.Search>;

      const { Search } = Input;
          
      const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
      
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="p-10">   
            {contextHolder}
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng đang chờ duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng đang chờ duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <WaitTable />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng đã xử lý" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng đã duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <DoneTable />
                    </div>
                </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Lý do từ chối đơn hàng" : "Reasons for order rejection"} onOk={() => handleReject(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showreasonmodal} onCancel={() => setShowreasonmodal(false)} onClose={() => setShowreasonmodal(false)}>
                <div className="flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Lý do:" : "Reason:"}</p>
                    <Input placeholder="Vui lòng nhập lý do cụ thể"
                           value={reasonRejection}
                           onChange={(e) => setReason(e.target.value)}/>
                </div>
            </Modal>

            <Modal title={language() == "Tiếng Việt" ? "Lý do huỷ đơn hàng" : "Reasons for order cancelation"} onOk={() => handleCancel(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showCancelmodal} onCancel={() => setShowcancelmodal(false)} onClose={() => setShowcancelmodal(false)}>
                <div className="flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Lý do:" : "Reason:"}</p>
                    <Input placeholder="Vui lòng nhập lý do cụ thể"
                           value={reasonCancelation}
                           onChange={(e) => setReasonCancel(e.target.value)}/>
                </div>
            </Modal>
        </div>
    )
}

export default OrderManagement