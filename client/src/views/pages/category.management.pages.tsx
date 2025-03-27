import AOS from "aos"
import "aos/dist/aos.css"
import { JSX, useState, useEffect } from "react";
import { ChevronUp, ShoppingCart, Plus } from "lucide-react"

//Giữ nguyên 
interface CategoryItem {
    category_name_translate_1: string;
    category_name_translate_2: string;
    created_at: string;
    index: number;
    translate_1_language: string;
    translate_2_language: string;
    updated_at: string;
    id: string;
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

interface Section {
    key: string;   // Khóa định danh
    href: string;  // Đường dẫn liên kết
    title: string; // Tiêu đề hiển thị
}

const Category = (): JSX.Element => {
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>(["burger"])
    const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])

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
    
    const addToCart = (itemId: number) => {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === itemId)
          if (existingItem) {
            return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
          } else {
            return [...prevCart, { id: itemId, quantity: 1 }]
          }
        })
    }
    
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)
    
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
    const [categoryView, setCategoryView] = useState<Section[]>([])

    // Hardcoded categories data to match the second code
    const categories = [
        {
          id: "burgers",
          name: "Bánh Burger",
          items: [
            {
              id: 1,
              name: "Burger Phô Mai Cổ Điển",
              description: "Thịt bò mọng nước với phô mai tan chảy, rau xà lách, cà chua và sốt đặc biệt của chúng tôi",
              price: 89000,
              image: "/public/images/system/burgerphomai_menu.jpg?height=200&width=200",
              popular: true,
            },
            {
              id: 2,
              name: "Burger Thịt Xông Khói Đôi",
              description: "Hai miếng thịt bò với thịt xông khói giòn, phô mai cheddar và sốt BBQ",
              price: 129000,
              image: "/public/images/system/burgerthitxongkhoi_menu.jpg?height=200&width=200",
            },
            {
              id: 3,
              name: "Burger Chay",
              description: "Miếng thịt từ thực vật với rau tươi và sốt mayonnaise chay",
              price: 99000,
              image: "/public/images/system/burgerchay_menu.jpg?height=200&width=200",
            },
          ],
        },
        {
          id: "chicken",
          name: "Gà Rán",
          items: [
            {
              id: 4,
              name: "Gà Giòn Thơm",
              description: "Những miếng gà mềm với lớp vỏ giòn, phục vụ kèm sốt chấm",
              price: 79000,
              image: "/public/images/system/gagionthom_menu.jpg?height=200&width=200",
              popular: true,
            },
            {
              id: 5,
              name: "Cánh Gà Cay",
              description: "Cánh gà giòn tẩm ướp trong sốt cay đặc trưng của chúng tôi",
              price: 109000,
              image: "/public/images/system/canhgacay_menu.jpg?height=200&width=200",
            },
            {
              id: 6,
              name: "Xô Gà",
              description: "10 miếng gà rán nổi tiếng của chúng tôi với hương vị nguyên bản và cay",
              price: 189000,
              image: "/public/images/system/xoga_menu.jpg?height=200&width=200",
            },
          ],
        },
        {
          id: "sides",
          name: "Món Phụ",
          items: [
            {
              id: 7,
              name: "Khoai Tây Chiên",
              description: "Khoai tây chiên giòn vàng được nêm với hỗn hợp gia vị đặc biệt",
              price: 39000,
              image: "/public/images/system/khoaitaychien_menu.jpg?height=200&width=200",
              popular: true,
            },
            {
              id: 8,
              name: "Vòng Hành Tây",
              description: "Vòng hành tây chiên giòn phục vụ kèm sốt chấm thái",
              price: 49000,
              image: "/public/images/system/vonghanhtay_menu.jpg?height=200&width=200",
            },
            {
              id: 9,
              name: "Salad Bắp Cải",
              description: "Bắp cải tươi và cà rốt được trộn trong dĩa sốt kem mặn",
              price: 29000,
              image: "/public/images/system/salad_menu.jpg?height=200&width=200",
            },
          ],
        },
        {
          id: "drinks",
          name: "Đồ Uống",
          items: [
            {
              id: 10,
              name: "Sữa Lắc",
              description: "Sữa lắc kem có sẵn các vị sô cô la, vani hoặc dâu",
              price: 59000,
              image: "/public/images/system/sualac_menu.jpg?height=200&width=200",
            },
            {
              id: 11,
              name: "Nước Ngọt",
              description: "Lựa chọn nước ngọt với đồ uống miễn phí",
              price: 24000,
              image: "/public/images/system/nuocngot_menu.jpg?height=200&width=200",
            },
            {
              id: 12,
              name: "Trà Đá",
              description: "Trà đá pha tươi, có đường hoặc không đường",
              price: 24000,
              image: "/public/images/system/trada_menu.jpg?height=200&width=200",
            },
          ],
        },
      ]

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
        console.log("Product đã cập nhật:", product);
        console.log("Category đã cập nhật:", category);
        console.log("Category menu đã cập nhật:", categoryView);
    }, [product, category, categoryView]); // Chạy lại khi state thay đổi
    
    useEffect(() => {
        if (product.length > 0) {
            const newCategoryView = product.map((item, index) => ({
                key: `part-${index + 1}`,  // Dùng ID duy nhất thay vì index
                href: `part-${index + 1}`,
                title: language() === "Tiếng Việt"
                    ? item.categories?.category_name_translate_1
                    : item.categories?.category_name_translate_2,
            }));
    
            console.log("Số lượng danh mục sau khi map:", newCategoryView.length);
            setCategoryView(newCategoryView);
        }
    }, [product]);

    return (
        // Header
        <div className="min-h-screen bg-orange-50">
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
                {/* Fixed Shopping Cart */}
                <div className="fixed top-30 right-5 z-50 bg-orange-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-orange-700 transition-colors animate-pulse-soft">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                        )}
                    </div>
                </div>
    
                <div className="container mx-auto px-4">
                    <h2 className="text-6xl font-bold font-['Yeseva_One'] text-center text-orange-800 mb-12 " data-aos="fade-down">Thực Đơn TankFood</h2>
    
                    {categories.map((category) => (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.items.map((item, index) => (
                                <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(194,65,12,0.07)] hover:shadow-[0_15px_35px_rgba(194,65,12,0.1)] transition-all duration-300 group"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                >
                                <div className="relative h-64 w-full overflow-hidden">
                                    <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {item.popular && (
                                    <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Phổ Biến
                                    </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-['Yeseva_One'] text-gray-800">{item.name}</h3>
                                    <span className="text-lg font-bold text-orange-700">{formatPrice(item.price)}</span>
                                    </div>
                                    <p className="text-gray-600 mb-6 text-sm font-['Roboto_Slab']">{item.description}</p>
                                    <button
                                    onClick={() => addToCart(item.id)}
                                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:from-orange-700 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                                    >
                                    <Plus className="w-5 h-5" />
                                    Thêm Vào Giỏ Hàng
                                    </button>
                                </div>
                                </div>
                            ))}
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