import { JSX, Dispatch, SetStateAction, useEffect } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Modal, Input, message, Table } from "antd";
import type { TableProps } from 'antd';
import MapPicker from "../components/Mapicket.components";
import Verify from "../components/VerifyToken.components";
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading.components";

// interface Products {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface OrderInformation {
//   account_name: string;
//   account_no: string;
//   bank_id: string;
//   distance: number;
//   fee: number;
//   order_id: string;
//   payment_qr_url: string;
//   product: Products[];
//   total_bill: number;
//   total_price: number;
//   total_quantity: number;
//   vat: number;
// }

// interface ApiResponse {
//   information: OrderInformation;
//   message: string;
// }
interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  priceAfterdiscount: number; 
  discount: number
}

  interface OrderData {
    language?: string|null;
    refresh_token: string|null;
    products: Product[];
    name: string|undefined;
    email: string|undefined;
    phone: string|undefined;
    receiving_longitude: number|undefined;
    receiving_latitude: number|undefined;
    note?: string|null;
    voucher?: string|null;
  }

  interface Product {
    product_id: string;
    quantity: number;
  }

  interface ProductView {
    title: string;
    quantity: number;
    total_price: string,
  }

  interface UserInfo {
    created_at: string;
    display_name: string;
    email: string;
    penalty: string | null;
    phone: string;
    role: number;
    updated_at: string;
    user_type: number;
    _id: string;
  }
  
  
interface MyCardProps {
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
    user_infor: UserInfo | null;
  }
const MyCard = ({ cart, setCart, user_infor }: MyCardProps, props: Props): JSX.Element => {
    const navigate = useNavigate(); 
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [dataBill, setDatabill] = useState<ProductView[]>([])
    // const [bill, setBill] = useState<ApiResponse>()

    useEffect(() => {
      const newData: ProductView[] = cart.map((cart) => ({
        title: cart.name,
        quantity: cart.quantity,
        total_price: formatPrice(cart.priceAfterdiscount * cart.quantity),
      })) 
      console.log(cart)
      setDatabill(newData)
    }, [cart])

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

    const [messageApi, contextHolder] = message.useMessage();
    const language = (): string => {
      const SaveedLanguage = localStorage.getItem('language')
      return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    }

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
    const [nameUser, setNameUser] = useState<string|undefined>(user_infor?.display_name)
    const [emailUser, setEmailUser] = useState<string|undefined>(user_infor?.email)
    const [phoneUser, setPhoneUser] = useState<string|undefined>(user_infor?.phone)
    const [note,setNote] = useState<string|null>("")
    const [voucher, setVoucher] = useState<string|null>("")

    // Hàm xử lý khi chọn vị trí trên bản đồ
    const handleLocationSelect = (lat: number, lng: number) => {
      setLocation({ lat, lng });
    };

    const handlePayment = () => {
      try {
        // setIsLoading(true)
        const checkToken = async () => {
          const isValid = await Verify(refresh_token, access_token);
          if (isValid) {
            const product: Product[] = cart.map((carts) => ({
              product_id: carts.id,
              quantity: carts.quantity
            }))
            const body: OrderData = {
              language: null,
              refresh_token: refresh_token,
              products: product,
              name: nameUser,
              email: emailUser,
              phone: phoneUser,
              receiving_longitude: location?.lng,
              receiving_latitude: location?.lat,
              note: note,
              voucher: voucher,
            }
            console.log(body)
  
            fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-online`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
            }).then(response => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.CREATE_ORDER_SUCCESSFUL){
                console.log(data);
                // navigate('/payment', { state: data })
                navigate('/payment', { replace: true, state: data })
                // setBill(data)
              } else {
                messageApi.error(data.message)
                return
              }
            })
          } else {
              messageApi.error("Token không hợp lệ!");
              return
          }
        };
        checkToken();
      } catch (error) {
        messageApi.error(String(error))
      } finally {
        setTimeout(() => {
          // setIsLoading(false)
        }, 3000)
      }
    }

    // useEffect(() => {
    //     if(bill !== null) {
    //       navigate('/payment', { replace: true, state: bill })
    //     }
    //     console.log(bill)
    // }, [bill, navigate])

    const increaseQuantity = (id: string) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };
  
    const decreaseQuantity = (id: string) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    };
  
    const removeItem = (id: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };
  
    const totalPrice = cart.reduce(
      (total, item) => total + item.priceAfterdiscount * item.quantity,
      0
    );
  
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(price);
    };

    const columnsBill: TableProps<ProductView>['columns'] = [
          {
            title: 'Đơn hàng',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            render: (text) => <p className="font-bold">{text}</p>,
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            render: (text) => <p>{text}</p>,
          },
          {
            title: 'Thành tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 150,
            render: (text) => <p>{text}</p>,
          },
        ];
          
        const TableBill: React.FC = () => <Table<ProductView> columns={columnsBill} dataSource={dataBill} pagination={false}/>;
  
    return (
      <div className="min-h-screen bg-orange-50 py-12">
        {contextHolder}
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold font-['Yeseva_One'] text-center text-orange-800 mb-8">
              Giỏ Hàng Của Bạn
            </h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm nhé!
            </p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">
                      Đơn giá: {formatPrice(item.priceAfterdiscount)}
                    </p>
                    <p className="text-gray-600">
                      Tổng: {formatPrice(item.priceAfterdiscount * item.quantity)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="mx-3 text-lg">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 bg-red-500 cursor-pointer text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="text-right mt-8">
                <h3 className="text-2xl font-semibold text-orange-800">
                  Tổng cộng: {formatPrice(totalPrice)}
                </h3>
                <button onClick={() => setShowPaymentModal(true)}
                        className="mt-4 py-3 cursor-pointer px-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-medium text-white hover:from-orange-700 hover:to-orange-600 transition-all duration-300">
                  Thanh Toán
                </button>
              </div>
            </div>
          )}
        </div>
        <Modal title={language() == "Tiếng Việt" ? "Xác nhận thông tin thanh toán sản phẩm" : "Confirm product payment information"} open={showPaymentModal} okText={language() == "Tiếng Việt" ? "Xác nhận thanh toán" : "Payment confirm"} onOk={() => handlePayment()} onCancel={() => setShowPaymentModal(false)} onClose={() => setShowPaymentModal(false)}>
            <Loading />
            <div className="w-full flex flex-col gap-4">
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tên người dùng:" : "Display name:"}</p>
                  <Input value={nameUser} onChange={(e) => setNameUser(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Số điện thoại:" : "Phone number:"}</p>
                  <Input value={phoneUser} onChange={(e) => setPhoneUser(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Email:" : "Email:"}</p>
                  <Input value={emailUser} onChange={(e) => setEmailUser(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col items-center">
                  <TableBill />
              </div>
              <div className="flex flex-col gap-5 items-center">
                <h2 className="bg-green-100 text-green-800 p-2 rounded-lg">Hãy chọn vị trí nhận hàng</h2>
                <MapPicker onLocationSelect={handleLocationSelect} />
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Ghi chú:" : "Note:"}</p>
                  <Input value={note ?? ""} onChange={(e) => setNote(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Voucher:" : "Voucher:"}</p>
                  <Input value={voucher ?? ""} onChange={(e) => setVoucher(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tổng tiền:" : "Total price:"}</p>
                  <Input value={formatPrice(totalPrice)} readOnly/>
              </div>
            </div>
        </Modal>
      </div>
    );
  };
  
  export default MyCard;