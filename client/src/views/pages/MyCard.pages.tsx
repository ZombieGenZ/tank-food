import { JSX, Dispatch, SetStateAction } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
    id: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }
  
interface MyCardProps {
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
  }
const MyCard = ({ cart, setCart }: MyCardProps): JSX.Element => {
    const increaseQuantity = (id: number) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };
  
    const decreaseQuantity = (id: number) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    };
  
    const removeItem = (id: number) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };
  
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(price);
    };
  
    return (
      <div className="min-h-screen bg-orange-50 py-12">
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
                      Đơn giá: {formatPrice(item.price)}
                    </p>
                    <p className="text-gray-600">
                      Tổng: {formatPrice(item.price * item.quantity)}
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
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="text-right mt-8">
                <h3 className="text-2xl font-semibold text-orange-800">
                  Tổng cộng: {formatPrice(totalPrice)}
                </h3>
                <button className="mt-4 py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-medium text-white hover:from-orange-700 hover:to-orange-600 transition-all duration-300">
                  Thanh Toán
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default MyCard;