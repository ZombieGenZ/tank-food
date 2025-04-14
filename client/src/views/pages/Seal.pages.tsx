"use client"
import { JSX } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import { message } from "antd"
import { Plus } from "lucide-react"
import "aos/dist/aos.css"
import Verify from "../components/VerifyToken.components"
import { RESPONSE_CODE } from "../../constants/responseCode.constants"
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL)

interface MenuItem {
  key: string,
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string|null;
  discount: number,
  priceAfterdiscount: number
}

interface MenuCategory {
  key: string,
  id: string;
  name: string;
  items: MenuItem[];
  hasProduct: boolean
}
//Giữ nguyên 
interface CategoryItem {
    category_name_translate_1: string;
    category_name_translate_2: string;
    created_at: string;
    index: number;
    translate_1_language: string;
    translate_2_language: string;
    updated_at: string;
    _id: string;
}

interface Product {
    _id: string;
    availability: boolean;
    categories: {
        _id: string;
        category_name_translate_1: string;
        category_name_translate_2: string;
        created_at: string;
        updated_at: string;
        index: number;
        translate_1_language: string;
        translate_2_language: string;
    };
    created_at: string;
    created_by: string;
    discount: number;
    description_translate_1: string;
    description_translate_1_language: string;
    description_translate_2: string;
    description_translate_2_language: string;
    preview: {
        path: string;
        size: number;
        type: string;
        url: string;
    };
    price: number;
    tag_translate_1: string;
    tag_translate_1_language: string;
    tag_translate_2: string;
    tag_translate_2_language: string;
    title_translate_1: string;
    title_translate_1_language: string;
    title_translate_2: string;
    title_translate_2_language: string;
    updated_at: string;
    updated_by: string;
}

interface Voucher {
  code: string;
  created_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
  discount: number;
  expiration_date: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
  quantity: number;
  requirement: number;
  updated_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
  used: number | null; // Giả sử used là số lượng voucher đã sử dụng, nếu null có thể chưa có dữ liệu
  _id: string;
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

interface CategoryProps {
  addToCart: (item: { id: string; name: string; price: number; image: string; priceAfterdiscount: number; discount: number }) => void;
  cart: CartItem[]; // Thêm cart vào props
  setIsloading: React.Dispatch<React.SetStateAction<boolean>>;
  props: NotificationProps
}

interface NotificationProps {
  addNotification: (message: string) => void;
}

const popularItems = [
  {
    id: 1,
    name: "Burger Phô Mai Đôi",
    description: "Hai lớp thịt bò với phô mai đặc biệt",
    price: 99000,
    image: "/images/system/burgerphomai_menu.jpg?height=150&width=150",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Gà Rán Cay",
    description: "Gà giòn với sốt cay bí truyền",
    price: 89000,
    image: "/images/system/garansotthai.jpg?height=150&width=150",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Khoai Tây Phủ",
    description: "Khoai tây phủ phô mai, thịt xông khói và ớt jalapeno",
    price: 69000,
    image: "/images/system/khoaitaychien_menu.jpg?height=150&width=150",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Milkshake Sô-cô-la",
    description: "Milkshake sô-cô-la đậm đà và béo ngậy",
    price: 49000,
    image: "/images/system/sualac_menu.jpg?height=150&width=150",
    rating: 4.9,
  },
]

const SealPage =({ addToCart, cart, setIsloading, props }: CategoryProps): JSX.Element =>{
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const language = (): string => {
          const SaveedLanguage = localStorage.getItem('language')
          return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
      }
  const [product, setProduct] = useState<Product[]>([])
  const [category, setCategory] = useState<CategoryItem[]>([])
  const [showProduct, setShowProduct] = useState<MenuCategory[]>([])
  const [voucher, setVoucher] = useState<Voucher[]>([])
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 
  
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
      socket.emit('connect-guest-realtime')
      socket.on('create-public-voucher', (res) => {
        setVoucher([...voucher, res])
        props.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới" : "New Voucher")
      })

      socket.on('update-public-voucher', (res) => {
        console.log(res)
        setVoucher(voucher.map((item) => item._id === res._id ? res : item))
        props.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới cập nhật" : "A Voucher Update")
      })

      socket.on('delete-public-voucher', (res) => {
        setVoucher(voucher.filter((item) => item._id !== res._id))
        props.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới bị xoá" : "A Voucher Delete")
      })

      socket.on('expired-public-voucher', (res) => {
        setVoucher(voucher.map((item) => item._id === res._id ? res : item))
        props.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới bị xoá" : "A Voucher Delete")
      })

      return () => {
        socket.off('create-public-voucher')
        socket.off('update-public-voucher')
        socket.off('delete-public-voucher')
        socket.off('expired-public-voucher')
      }
    })

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          const body = {
            language: null,
            refresh_token: refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
          }).then(response => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.GET_VOUCHER_FAILED) {
              messageApi.error("Lỗi khi lấy danh sách voucher");
              return
            }
            if(data.code == RESPONSE_CODE.GET_VOUCHER_SUCCESSFUL) {
              setVoucher(data.voucher)
            }
          })
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }, [refresh_token, access_token, messageApi])

  useEffect(() => {
    console.log("Show cart: ", cart)
    console.log(voucher)
  }, [cart, voucher])

  useEffect(() => {
    const fetchData = async () => {
        const body = { language: null };
  
        const productRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products/get-product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const productData = await productRes.json();
  
        const categoryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const categoryData = await categoryRes.json();
  
        setProduct(productData.products || []); // Nếu dữ liệu null thì gán []
        setCategory(categoryData.categories || []);
    }
  
      fetchData()
    }, [])

  useEffect(() => {
    const newData: MenuCategory[] = category.map((categorys, index) => {
      const newProduct: MenuItem[] = product
          .filter((p) => p.categories?._id === categorys?._id)
          .map((p, idx) => ({
            key: String(idx + 1),
            id: p._id,
            name: language() === "Tiếng Việt" ? p.title_translate_1 : p.title_translate_2,
            description: language() === "Tiếng Việt" ? p.description_translate_1 : p.description_translate_2,
            price: p.price,
            image: p.preview.url,
            tag: language() === "Tiếng Việt" ? p.tag_translate_1 : p.tag_translate_2,
            discount: p.discount,
            priceAfterdiscount: p.price - (p.price * p.discount/100)
          }));
        return({
          key: String(index + 1),
          id: categorys._id,
          name: language() == "Tiếng Việt" ? categorys.category_name_translate_1 : categorys.category_name_translate_2,
          items: newProduct,
          hasProduct: newProduct.length > 0
        })
      })
      setShowProduct(newData)
    }, [product, category])

  useEffect(() => {
    AOS.init({
      duration: 1100,
      once: false,
      mirror: true,
      offset: 100
    })
  }, [])

  // Removed duplicate declaration of the language function

  const handleSaveVoucher = (VoucherId: string) => {
    if(refresh_token == null) {messageApi.error("Vui lòng đăng nhập để lưu Voucher!"); return};
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          try {
            setIsloading(true)
            const body = {
              language: null,
              refresh_token: refresh_token,
              voucher_id: VoucherId
            };
            fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/storage-voucher`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if(data.code === RESPONSE_CODE.STORAGE_VOUCHER_FAILED) {
                  messageApi.error(data.message)
                  return
                }
                if (data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                  messageApi.error(data.errors.voucher_id.msg)
                  return
                }
                if (data.code === RESPONSE_CODE.STORAGE_VOUCHER_SUCCESSFUL) {
                  messageApi.open({
                    type: 'success',
                    content: 'Lưu mã giảm giá thành công!',
                  })
                }
              });
          } catch (error) {
            messageApi.error(String(error))
            return;
          } finally {
            setTimeout(() => {
              setIsloading(false)
            }, 4000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken();
  }

  const ComboCategory = showProduct.find((product) => product.name.includes("Combo"));

  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }

  function formatDateFromISO(isoDateString: string): string {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Phần Hero */}
      {contextHolder}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="opacity-0 translate-y-4" data-aos="fade-up" data-aos-duration="500">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Khuyến Mãi Cực Sốc!</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Nhanh tay đặt ngay để thưởng thức những ưu đãi hấp dẫn
            </p>
            <button onClick={() => navigate('/menu')} className="px-6 py-3 cursor-pointer bg-white text-orange-600 hover:bg-orange-100 rounded-md font-medium text-lg flex items-center justify-center mx-auto">
              Đặt Hàng Ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-50 to-transparent"></div>
      </section>

      {/* Phần Combo Deals */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Combo Khuyến Mãi Hấp Dẫn</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tiết kiệm hơn với các combo giá trị. Hoàn hảo để chia sẻ cùng gia đình và bạn bè!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {ComboCategory ? (
            ComboCategory.items.map((combo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3]">
                  <img 
                    src={combo.image || "/placeholder.svg"} 
                    alt={combo.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {combo.tag && (
                    <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {combo.tag}
                    </span>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg md:text-xl mb-1 line-clamp-2">{combo.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{combo.description}</p>
                  
                  {/* Price Section */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-base md:text-lg text-gray-500 line-through">
                        {formatCurrency(combo.price)}
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-orange-600">
                        {formatCurrency(combo.priceAfterdiscount)}
                      </span>
                    </div>
                    
                    {/* Button */}
                    <button onClick={() => addToCart(combo)} className="w-full cursor-pointer flex justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium transition-colors duration-300">
                      <Plus /> Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
              <div className="max-w-md mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy Combo</h3>
                <p className="text-gray-500">Hiện không có combo nào khả dụng. Vui lòng quay lại sau.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Phần Món Ăn Phổ Biến */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Món Ăn Yêu Thích</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Những món ăn được yêu thích nhất khiến khách hàng luôn quay lại
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                data-aos="zoom-in"
                data-aos-delay={item.id * 100}
              >
                <div className="p-4 flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{formatCurrency(item.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Ưu Đãi Đặc Biệt */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Voucher và thẻ giảm giá</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Những ưu đãi có thời hạn bạn không nên bỏ lỡ</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="block" data-aos="fade-right">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 text-orange-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <h3 className="font-bold text-xl">Voucher Ưu Đãi</h3>
                  </div>
                  <span className="text-sm text-gray-500">Áp dụng có thời hạn</span>
                </div>
              </div>

              {/* Voucher List */}
              <div className="p-4">
                <div className="space-y-4">
                  {/* Voucher List */}
                  {voucher ? (
                    voucher.map((discount, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col sm:flex-row items-center justify-between p-4 border border-orange-200 rounded-lg hover:shadow-md transition-shadow duration-300 bg-white"
                      >
                        {/* Voucher Info */}
                        <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                          <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-orange-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z"
                              />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-base sm:text-lg">
                              Giảm {formatCurrency(discount.discount)} cho đơn từ {formatCurrency(discount.requirement)}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              HSD: {formatDateFromISO(discount.expiration_date)}
                            </p>
                          </div>
                        </div>

                        {/* Save Button */}
                        <button onClick={() => handleSaveVoucher(discount._id)}
                          className="px-4 py-2 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 w-full sm:w-auto"
                        >
                          Lưu Voucher
                        </button>
                      </div>
                    ))
                  ) : (
                    /* Empty State */
                    <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" 
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher nào</h3>
                      <p className="text-gray-500">Hiện không có voucher khả dụng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phần Hướng Dẫn Sử Dụng Voucher */}
      <section className="bg-gradient-to-br from-amber-100 to-orange-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cách Sử Dụng Voucher</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Làm theo các bước đơn giản để tận hưởng ưu đãi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 1</h3>
              <p className="text-gray-600">Thêm món ăn yêu thích vào giỏ hàng và đạt mức chi tiêu tối thiểu</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 2</h3>
              <p className="text-gray-600">Nhập hoặc chọn mã voucher tại ô mã khuyến mãi khi thanh toán</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 3</h3>
              <p className="text-gray-600">Tận hưởng bữa ăn ngon với mức giá tiết kiệm!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Thời Gian Có Hạn */}
      <section className="container mx-auto px-4 py-8">
        <div
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden"
          data-aos="fade-up"
        >
          <div className="absolute top-0 right-0 w-40 h-40 -mt-10 -mr-10 bg-yellow-500 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-yellow-500 rounded-full opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3 className="text-xl font-bold">Ưu Đãi Có Thời Hạn!</h3>
              </div>
              <p className="mt-2">Các khuyến mãi sẽ kết thúc sớm. Đặt hàng ngay trước khi hết hạn!</p>
            </div>
            <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-md font-medium text-lg">
              Đặt Hàng Ngay
            </button>
          </div>
        </div>
      </section>
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 2 + 1}rem`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: 0.3,
                }}
              >
                🍔
              </div>
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i + 20}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 2 + 1}rem`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: 0.3,
                }}
              >
                🍟
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-3xl mx-auto text-center"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            data-aos-anchor-placement="top-bottom"
          >
            <div className="mb-8 transform transition-transform duration-700 hover:scale-105">
              <h2
                className="text-6xl font-bold mb-2 text-white drop-shadow-lg"
                style={{
                  textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                TankFood
              </h2>
              <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
              Thưởng thức những món ăn ngon nhất với dịch vụ giao hàng nhanh chóng và tiện lợi!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="300">
              <input
                type="email"
                placeholder="Địa Chỉ Email Của Bạn"
                className="flex-grow px-4 py-3 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-yellow-50 px-6 py-3 rounded-md font-bold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                Đặt Hàng Ngay
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-6" data-aos="fade-up" data-aos-delay="500">
              {["Burger", "Gà Rán", "Pizza", "Đồ Uống"].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium shadow-md hover:bg-white/30 cursor-pointer transition-all"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="relative h-16">
            <div
              className="absolute bottom-0 left-0 w-[200%] h-16"
              style={{
                background:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                backgroundSize: "100% 100%",
                animation: "wave 15s linear infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <footer className="py-8 bg-orange-800 text-white">
                <div className="container mx-auto px-4 text-center">
                <p className="font-['Roboto_Slab']">© 2025 TankFood. Đã đăng ký bản quyền.</p>
                </div>
            </footer>
    </div>
  )
}

export default SealPage

