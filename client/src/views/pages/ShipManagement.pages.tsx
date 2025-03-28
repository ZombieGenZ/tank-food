import { JSX, useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import type { TableProps } from 'antd';
import { RESPONSE_CODE } from "../../constants/responseCode.constants";

interface DataType {
    key: string;
    id: string,
    title: string;
    phone_user: string;
    total_price: number;
    address: string;
    payment_type: string;
    payment_status: string;
    order_status: string;
    delivery_latitude: number | null;
    delivery_longitude: number | null;
  }

interface Order {
    _id: string;
    canceled_at: string;
    canceled_by: string | null;
    cancellation_reason: string;
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

const ShipManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [messageApi, contextHolder] = message.useMessage();

    const [billnoshipper, setBillnoshipper] = useState<DataType[]>([])
    const [billhaveshipper, setBillhaveshipper] = useState<DataType[]>([])
    const [billwait, setBillwait] = useState<Order[]>([])
    const [billtaked, setBilltaked] = useState<Order[]>([])


    const takeLocation = (longtitude: number | null, lattitude: number | null) => {
      if(longtitude == null || lattitude == null) return;
      messageApi.info(`${longtitude} | ${lattitude}`)
    }

    const handleAcceptBill = (orderID: string) => {
      const body = {
        language: null,
        refresh_token: refresh_token,
        order_id: orderID
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/orders/receive-delivery`, {
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
        if(data.code == RESPONSE_CODE.RECEIVE_DELIVERY_SUCCESSFUL) {
          messageApi.success(data.message)
          const body = {
            language: null,
            refresh_token: refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
              console.log(data)
              if(data.code == "GET_ORDER_SUCCESSFUL") {
                  setBillwait(data.order)
              }
          })

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
            console.log(data)
            if(data.code == "GET_ORDER_SUCCESSFUL") {
                setBilltaked(data.order)
            }
          })
        } else {
          messageApi.error(data.errors.order_id.msg)
          return
        }
      })
    }

    const handleConfirm = (orderID: string) => {
      const body = {
        language: null,
        refresh_token: refresh_token,
        order_id: orderID
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/orders/confirm-delivery-completion`, {
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
            refresh_token: refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
              console.log(data)
              if(data.code == "GET_ORDER_SUCCESSFUL") {
                  setBillwait(data.order)
              }
          })

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
            console.log(data)
            if(data.code == "GET_ORDER_SUCCESSFUL") {
                setBilltaked(data.order)
            }
          })
        } else {
          messageApi.error(data.errors.order_id.msg)
          return
        }
      })
    }

    const handleCancelBill = (orderID: string) => {
      const body = {
        language: null,
        refresh_token: refresh_token,
        order_id: orderID
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/orders/cancel-order-shipper`, {
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
            refresh_token: refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
              console.log(data)
              if(data.code == "GET_ORDER_SUCCESSFUL") {
                  setBillwait(data.order)
              }
          })

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
          }).then(response => {
              return response.json()
          }).then((data) => {
            console.log(data)
            if(data.code == "GET_ORDER_SUCCESSFUL") {
                setBilltaked(data.order)
            }
          })
        } else {
          messageApi.error(data.errors.order_id.msg)
          return
        }
      })
    }

    useEffect(() => {
      const newData: DataType[] = billwait.map((bill, index) => ({
        key: String(index + 1),
        id: bill._id,
        title: bill.product.length > 0 ? bill.product[0].title_translate_1 : "Không có sản phẩm",
        phone_user: bill.phone || "N/A",
        total_price: bill.total_bill ?? 0,
        address: bill.receiving_address || "Không có địa chỉ",
        payment_type: bill.payment_type === 0 ? "Tiền mặt" : (bill.payment_type === 1 ? "Chuyển khoản" : "Không xác định"),
        delivery_latitude: bill.delivery_latitude ?? null,
        delivery_longitude: bill.delivery_longitude ?? null,
        payment_status: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                        bill.payment_status === 1 ? "Thành công" :
                        bill.payment_status === 2 ? "Thất bại" : "Không xác định",
        order_status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                        bill.order_status === 1 ? "Duyệt thành công" : 
                        bill.order_status === 2 ? "Đang giao" : 
                        bill.order_status === 3 ? "Giao đơn thành công" : 
                        bill.order_status === 4 ? "Thành công" : "Thất bại",                
        
      }));

      const newData1: DataType[] = billtaked.map((bill, index) => ({
        key: String(index + 1),
        id: bill._id,
        title: bill.product.length > 0 ? bill.product[0].title_translate_1 : "Không có sản phẩm",
        phone_user: bill.phone || "N/A",
        total_price: bill.total_bill ?? 0,
        address: bill.receiving_address || "Không có địa chỉ",
        payment_type: bill.payment_type === 0 ? "Tiền mặt" : (bill.payment_type === 1 ? "Chuyển khoản" : "Không xác định"),
        delivery_latitude: bill.delivery_latitude ?? null,
        delivery_longitude: bill.delivery_longitude ?? null,
        payment_status: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                        bill.payment_status === 1 ? "Thành công" :
                        bill.payment_status === 2 ? "Thất bại" : "Không xác định",
        order_status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                        bill.order_status === 1 ? "Duyệt thành công" : 
                        bill.order_status === 2 ? "Đang giao" : 
                        bill.order_status === 3 ? "Giao đơn thành công" : 
                        bill.order_status === 4 ? "Thành công" : "Thất bại",                
        
      }));

        setBillnoshipper(newData);
        setBillhaveshipper(newData1);
    }, [billwait, billtaked])


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
        const body = {
            language: null,
            refresh_token: refresh_token
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == "GET_ORDER_SUCCESSFUL") {
                setBillwait(data.order)
            }
        })

        fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == "GET_ORDER_SUCCESSFUL") {
                setBilltaked(data.order)
            }
        })
    }, [refresh_token, access_token])

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
          case "Chuyển khoản":
              return "#D4EDDA"; // Xanh lá
          case "Tiền mặt":
              return "#D1ECF1"; // Đỏ
          default:
              return "#E2E3E5"; // Xám
      }
  };

    const columns: TableProps<DataType>['columns'] = [
      {
        title: 'Đơn hàng',
        dataIndex: 'title',
        key: 'title',
        render: (text) => <p className="font-bold">{text}</p>,
      },
      {
        title: 'Số điện thoại người đặt',
        dataIndex: 'phone_user',
        key: 'phone_user',
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Giá tiền',
        dataIndex: 'total_price',
        key: 'total_price',
      },
      {
        title: 'Địa chỉ giao hàng',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Map',
        key: 'map',
        render: (_text, record) => (
          <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={() => takeLocation(record.delivery_longitude, record.delivery_latitude)}>
            🗺️ Xem bản đồ
          </Button>
        ),
      },
      {
        title: 'Thanh toán',
        key: 'payment_status',
        dataIndex: 'payment_status',
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
        title: 'Phương thức thanh toán',
        key: 'payment_type',
        dataIndex: 'payment_type',
        render: (status) => (
          <span 
              style={{
                  backgroundColor: getPaymentColor(status),
                  color: "green",
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
        title: '',
        key: 'action',
        dataIndex: 'action',
        render: (_text, record) => (
          <Button style={{ color:"green" }} onClick={() => handleAcceptBill(record.id)}>
           ✅ Nhận đơn hàng
          </Button>
        ),
      },
    ];

    const columnsShipper: TableProps<DataType>['columns'] = [
      {
        title: 'Đơn hàng',
        dataIndex: 'title',
        key: 'title',
        width: 150,
        render: (text) => <p className="font-bold">{text}</p>,
      },
      {
        title: 'Số điện thoại người đặt',
        dataIndex: 'phone_user',
        key: 'phone_user',
        width: 150,
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Giá tiền',
        dataIndex: 'total_price',
        key: 'total_price',
        width: 150,
      },
      {
        title: 'Địa chỉ giao hàng',
        dataIndex: 'address',
        key: 'address',
        width: 250,
      },
      {
        title: 'Map',
        key: 'map',
        width: 50,
        render: (_text, record) => (
          <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={() => takeLocation(record.delivery_longitude, record.delivery_latitude)}>
            🗺️ Xem bản đồ
          </Button>
        ),
      },
      {
        title: 'Phương thức thanh toán',
        key: 'payment_type',
        dataIndex: 'payment_type',
        width: 150,
        render: (status) => (
          <span 
              style={{
                  backgroundColor: getPaymentColor(status),
                  color: "green",
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
        title: 'Trạng thái đơn hàng',
        key: 'order_status',
        width: 200,
        dataIndex: 'order_status',
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
        title: '',
        key: 'action',
        dataIndex: 'action',
        width: 100,
        render: (_text, record) => {
          if(record.order_status == "Thành công") {
            return <p className="text-green-500 font-bold">Giao đơn hàng thành công</p>
          }
          return(
          <div className="flex flex-col gap-1">
            <Button style={{ color:"green" }} onClick={() => handleConfirm(record.id)}>
              ✅ Xác nhận giao hàng thành công
            </Button>
            <Button style={{  color:"red" }} onClick={() => handleCancelBill(record.id)}>
             ❌ Huỷ chọn đơn
            </Button>
          </div>
        )},
      },
    ];
      
      const TableNoshipper: React.FC = () => <Table<DataType> columns={columns} dataSource={billnoshipper} pagination={{ pageSize: 25 }}/>;
      const TableShipperTake: React.FC = () => <Table<DataType> columns={columnsShipper} dataSource={billhaveshipper} pagination={{ pageSize: 25 }}/>;

    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className=" p-10">
           {contextHolder}
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex items-center justify-between">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách đơn hàng chưa nhận giao hàng" : "List of orders not yet delivered"}</p>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <TableNoshipper />
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách đơn hàng đang giao" : "List of orders being delivered"}</p>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <TableShipperTake />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShipManagement;