import AOS from "aos"
import "aos/dist/aos.css"
import { JSX, useState, useEffect } from "react";
import { ChevronUp, Plus } from "lucide-react"
// import { message } from 'antd';

interface MenuItem {
  key: string,
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;// Tuỳ chọn, chỉ có khi món ăn phổ biến
}

interface MenuCategory {
  key: string,
  id: string;
  name: string;
  items: MenuItem[];
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

// interface Section {
//     key: string;   // Khóa định danh
//     href: string;  // Đường dẫn liên kết
//     title: string; // Tiêu đề hiển thị
// }


interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface CategoryProps {
  addToCart: (item: { id: string; name: string; price: number; image: string }) => void;
  cart: CartItem[]; // Thêm cart vào props
}

const Category = ({ addToCart, cart }: CategoryProps): JSX.Element => {
  // const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  // const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  // const [messageApi, contextHolder] = message.useMessage();
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>(["burger"])

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setRefreshToken(localStorage.getItem("refresh_token"));
  //     setAccessToken(localStorage.getItem("access_token"));
  //   };
            
  //   window.addEventListener("storage", handleStorageChange);
            
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

    useEffect(() => {
        AOS.init({
        duration: 1300,
        offset: 100, 
        once: false,
        mirror: true
        })
    }, [])

    const toggleCategory = (categoryId: string) => {
        setCollapsedCategories((prev) =>
          prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }
    
    // const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)
    
      // Format price in VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(price)
    }

    const language = (): string => {
        const SaveedLanguage = localStorage.getItem('language')
        return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    }
    const [product, setProduct] = useState<Product[]>([])
    const [category, setCategory] = useState<CategoryItem[]>([])
    const [showProduct, setShowProduct] = useState<MenuCategory[]>([])


    useEffect(() => {
      const newData: MenuCategory[] = category.map((categorys, index) => {
        const newProduct: MenuItem[] = product
          .filter((p) => p.categories._id === categorys._id)
          .map((p, idx) => ({
            key: String(idx + 1),
            id: p._id,
            name: language() === "Tiếng Việt" ? p.title_translate_1 : p.title_translate_2,
            description: language() === "Tiếng Việt" ? p.description_translate_1 : p.description_translate_2,
            price: p.price,
            image: p.preview.url,
          }));
        return({
          key: String(index + 1),
          id: categorys._id,
          name: language() == "Tiếng Việt" ? categorys.category_name_translate_1 : categorys.category_name_translate_2,
          items: newProduct,
        })
      })
      setShowProduct(newData)
    }, [product, category])

    useEffect(() => {
      console.log("Show cart: ", cart)
    }, [cart])
    // Hardcoded categories data to match the second code

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
    return (
        // Header
        <div className="min-h-screen bg-orange-50">
          {/* {contextHolder} */}
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden bg-gradient-to-r from-red-400 to-orange-200">
                {/* Main content */}
                <div className="container mx-auto px-4 pt-16 pb-64 md:pt-24 md:pb-72 relative z-10">
                    <div className="flex justify-center mb-8" data-aos="zoom-in-up">
                        <img
                        src="/public/images/system/logo tank food.png?height=100&width=300"
                        alt="TankFood logo"
                        width={300}
                        height={100}
                        className="object-contain"
                        />
                    </div>
    
                    <div className="text-center text-white mb-6" data-aos="zoom-out-up">
                        <p className="text-xl md:text-2xl font-san">Nấu, Khuấy và Sẵn Sàng để Phục Vụ</p>
                    </div>
    
                    <div className="text-center" data-aos="zoom-out-up">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold font-['Yeseva_One'] text-amber-300 tracking-wider drop-shadow-lg">
                        TANKFOOD
                        </h1>
                    </div>
    
                    <div className="flex justify-center mt-12" data-aos="fade-right">
                        <div className="relative w-64 h-64 md:w-120 md:h-80">
                        <img src="/public/images/system/chicken_menu(tn).png?height=400&width=400" alt="chicken" className="object-contain" />
                        </div>
                    </div>
                    <div className="flex justify-center mt-12" data-aos="fade-left">
                        <div className="relative w-64 h-64 md:w-105 md:h-80">
                        <img src="/public/images/system/burger_menu2tn.png?height=400&width=400" alt="burger" className="object-contain" />
                        </div>
                    </div>
                </div>
            </section>
    
            {/* Menu Items Section with Soft Orange Background */}
            <section className="relative bg-gradient-to-r from-red-400 to-orange-200 pt-16 pb-20">
    
                <div className="container mx-auto px-4">
                    <h2 className="text-6xl font-bold font-['Yeseva_One'] text-center text-orange-800 mb-12 " data-aos="fade-down">Thực Đơn TankFood</h2>
    
                    {showProduct.map((category) => (
                        <div key={category.id} className="mb-12" data-aos="fade-up">
                        <div
                            className="flex justify-between items-center cursor-pointer mb-6 group"
                            onClick={() => toggleCategory(category.id)}
                        >
                            <h2 className="text-4xl font-bold font-['Yeseva_One'] text-orange-800 group-hover:text-orange-700 transition-colors">
                            {category.name}
                            </h2>
                              <ChevronUp
                              className={`w-8 h-8 text-orange-800 transition-transform duration-300 ${
                                  collapsedCategories.includes(category.id) ? "rotate-180" : ""
                              }`}
                            />
                        </div>
    
                        {!collapsedCategories.includes(category.id) && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.items.length !== 0 ? category.items.map((item, index) => (
                                <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(194,65,12,0.07)] hover:shadow-[0_15px_35px_rgba(194,65,12,0.1)] transition-all duration-300 group"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                >
                                <div className="relative flex justify-center pt-6">
                                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-['Yeseva_One'] text-gray-800">{item.name}</h3>
                                    <span className="text-lg font-bold text-orange-700">{formatPrice(item.price)}</span>
                                    </div>
                                    <p className="text-gray-600 mb-6 text-sm font-['Roboto_Slab']">{item.description}</p>
                                    <button
                                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:from-orange-700 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                                    >
                                    <Plus className="w-5 h-5" />
                                    Thêm Vào Giỏ Hàng
                                    </button>
                                </div>
                                </div>
                            )) : <p className="font-bold text-center">Hiện chưa có sản phẩm cho mục này</p>}
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </section>
    
            {/* Footer */}
            <footer className="py-8 bg-orange-800 text-white">
                <div className="container mx-auto px-4 text-center">
                <p className="font-['Roboto_Slab']">© 2025 TankFood. Đã đăng ký bản quyền.</p>
                </div>
            </footer>
        </div>
    )
}

export default Category