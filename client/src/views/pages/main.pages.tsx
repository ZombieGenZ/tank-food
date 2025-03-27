import { NavbarUser } from '../components/navbar_component.tsx';
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer , Select } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from 'react'
import Signup from './signup.pages.tsx';
import { Divider  } from '@mantine/core';
import Category from './category.management.pages.tsx';
import SealPage from './Seal.pages.tsx';
import CategoryManagement from './CategoryManagement.pages.tsx';
import ProductManagement from './Product.pages.tsx';
import ShipManagement from './ShipManagement.pages.tsx';
import ContactUs from './contact.pages.tsx';
import DiscountCodeManagement from './Discount.pages.tsx';
import OrderManagement from './Order.psges.tsx';
import MainManage from './Main.management.pages.tsx';
import { Dropdown, Button } from "antd";
import { message,Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { gsap } from 'gsap';
import type { MenuProps } from 'antd';
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdAccountBox } from "react-icons/md";
import Loading from '../components/loading_page_components.tsx'
import Aboutus from './aboutus.pages.tsx';
import Account from './Account.management.pages.tsx';
import { RiUser3Line, RiHome5Line, RiShoppingCart2Line, RiTruckLine, RiPriceTag3Line, RiShoppingBag3Line } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IconType } from "react-icons";
import AOS from "aos";
import { Calendar } from 'lucide-react';
import "aos/dist/aos.css"; 
interface MenuItem {
  id: number;
  title: string;
  english: string;
  path: string;
  icon: IconType;
  active: boolean;
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

// Define the Navbar item type
interface NavbarItem {
  id: number;
  title: string;
  english: string,
  path: string;
}

// Define the slide type for the slideshow
interface Slide {
  src: string;
  alt: string;
  effect: "zoom" | "fade" | "slide" | "fade-zoom";
}

const FormMain = (): JSX.Element => {
  const language = () => {
    const SaveedLanguage = localStorage.getItem('language')
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  }
  function NavAdmin({ display_name }: {display_name: string}) {
    const [language, setLanguage] = useState<string>(() => {
      const SaveedLanguage = localStorage.getItem('language')
      return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    })
  
    const handleChange = (value: string) => {
      setLanguage(value)
      localStorage.setItem('language', JSON.stringify(value))
      if(value == "Tiếng Việt") {
        localStorage.setItem('code_language', JSON.stringify("vi-VN"))
      } else {
        localStorage.setItem('code_language', JSON.stringify("en-US"))
      }
      window.location.reload()
    };
  
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <button
            className='flex gap-2 items-center'
          ><FaRegUserCircle /> Thông tin tài khoản</button>
        ),
      },
      {
        key: '2',
        label: (
          <button
            className='flex gap-2 items-center'
          ><IoLogOutOutline /> Đăng xuất</button>
        ),
      },
    ];
    return(
      <div className="bg-white sticky top-0 z-50 shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{display_name}</h1>
          <div className="flex items-center gap-5">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-500" />
              <span className="text-sm text-gray-500">24/03/2025</span>
            </div>
            <Select
              defaultValue={language}
              size='small'
              options={[{ value: 'Tiếng Việt', label: 'Tiếng Việt - VI' },
                        { value: 'English', label: 'English - EN' },
                      ]}
              onChange={handleChange}
            />
            <Dropdown menu={{ items }} 
                      placement="bottom">
              <div className='text-[#FF7846] bg-white p-2 rounded-2xl hover:text-white hover:bg-[#FF7846] transition duration-300'>
                <MdAccountBox />
              </div>
            </Dropdown>
            </div>
        </div>
    )
  }
  // window.location.reload()
  const [loading, setLoading] = useState<boolean>(true)
  const location = useLocation();
  const pageRef = useRef(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserInfo | null>(null)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3300)
  }, [])

  useEffect(() => {
    if (!refresh_token) {
      console.log("Hãy đăng nhập để chúng tôi xác minh vai trò !");
      return;
    }
  
    console.log("Đăng nhập thành công !");
  
    const body = {
      language: null,
      refresh_token: refresh_token,
    };
  
    fetch(`${import.meta.env.VITE_API_URL}/api/users/get-user-infomation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.infomation);
      })
      .catch((error) => console.error("Lỗi khi lấy thông tin người dùng:", error));
  }, [refresh_token, access_token]); // Theo dõi thay đổi của refreshToken và accessToken
  
  // Lắng nghe thay đổi từ localStorage (ví dụ: khi user đăng nhập)
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
    console.log(user)
  }, [user])

  useEffect(() => {
    // Hiệu ứng khi chuyển trang
    gsap.from(pageRef.current, {
      scale: 0.8, // Bắt đầu với kích thước nhỏ hơn
      duration: 0.3,
      ease: 'back.out(1.7)', // Easing với hiệu ứng "bounce"
    });

    gsap.to(pageRef.current, {
      scale: 1, // Trở về kích thước ban đầu
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  }, [location]);

  return(
    <>

        {loading ? <Loading /> : (user && user.role == 3 ? 
          <div className='flex relative'>
            <NavigationAdmin displayname={user.display_name}/>
            <div className='w-full flex flex-col'>
              <NavAdmin display_name={`${language() == "Tiếng Việt" ? "Bảng thống kê" : "Dash board"}`}/>
              <Routes>
                <Route path="/*" element={<MainManage />} />
                <Route path="/Account" element={<Account />} />
                <Route path='/category' element={<CategoryManagement />}/>
                <Route path='/order' element={<OrderManagement />}/>
                <Route path='/product' element={<ProductManagement />}/>
                <Route path='/ship' element={<ShipManagement />}/>
                <Route path='/discount' element={<DiscountCodeManagement />}/>
              </Routes>
            </div>
          </div> : 
          <div className='flex gap-5 flex-col' ref={pageRef}>
            <NavigationButtons role={user?.role ?? 0}/>
            <Routes>
              <Route path="/*" element={<Main />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/signup" element={<Signup />} />
              <Route path='/menu' element={<Category />}/>
              <Route path='/deal' element={<SealPage />}/>
              <Route path='/contact' element={<ContactUs />}/>
            </Routes>
          </div>)}
    </>
  )   
}

function NavigationAdmin({ displayname }: { displayname: string }): JSX.Element {
  const navigate = useNavigate();
  const [navbar, setNavbar] = useState<MenuItem[]>([
    { id: 1, title: 'Trang chủ', english: 'Home', path: '/', icon: FaHome , active: true },
    { id: 2, title: 'Quản lý tài khoản', english: 'Account Management', path: 'Account', icon: RiUser3Line , active: false },
    { id: 3, title: 'Quản lý danh mục', english: 'Category Management', path: '/category', icon: RiHome5Line , active: false },
    { id: 4, title: 'Quản lý sản phẩm', english: 'Product Management', path: '/product', icon: RiShoppingBag3Line , active: false },
    { id: 5, title: 'Quản lý đơn đặt hàng', english: 'Order Management', path: '/order', icon: RiShoppingCart2Line , active: false },
    { id: 6, title: 'Quản lý giao hàng', english: 'Shipping Management', path: '/ship', icon: RiTruckLine, active: false },
    { id: 7, title: 'Quản lý mã giảm giá', english: 'Discount Management', path: '/discount', icon: RiPriceTag3Line , active: false }
  ])
  const [language, setLanguage] = useState<string>(() => {
    const SaveedLanguage = localStorage.getItem('language')
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  });
  
  useEffect(() => {
    setLanguage(language)
  }, [language]);
  
  // Define menu items similar to the admin dashboard example

  const handleClick = (id: number) => {
    setNavbar((prevItems) => 
      prevItems.map(item => 
        item.id === id ? { ...item, active: true } : { ...item, active: false }
      )
    );
  };
  
  return (
    <div className='w-1/5 sticky left-0 top-0 bg-slate-800 text-white h-screen'>
      <div className='p-4 flex items-center space-x-3'>
        <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
        <span className='text-lg font-bold'>BUI DANG KHOA</span>
      </div>
      <div className='mt-8'>
        {navbar.map((item) => {
          const isActive = item.active;
          return (
            <div 
              key={item.id} 
              onClick={() => {navigate(item.path); handleClick(item.id)}}
              className={`flex items-center px-4 py-3 cursor-pointer ${isActive ? 'bg-slate-700 border-l-4 border-orange-500' : 'hover:bg-slate-700'}`}
            >
              <div className={`mr-3 ${isActive ? 'text-orange-500' : 'text-gray-300'}`}>
                <item.icon size={20} />
              </div>
              <span className={isActive ? 'text-orange-500 font-medium' : 'text-gray-300'}>
                {language === "Tiếng Việt" ? item.title : item.english}
              </span>
            </div>
          )
        })}
      </div>
      
      <div className='absolute bottom-0 left-0 w-full p-4 border-t border-slate-700'>
        <div className='flex items-center space-x-3 gap-2'>
          <Avatar
            size={32}
            icon={<AntDesignOutlined />}
            style={{
              backgroundColor: "#1890ff",
              color: "#fff",
            }}
          />
          <div>
            <p className='text-sm font-medium text-white'>{displayname}</p>
            <p className='text-xs text-gray-400'>admin@example.com</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}



function NavigationButtons({ role }: { role: number }): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [language, setLanguage] = useState<string>(() => {
    const SaveedLanguage = localStorage.getItem('language')
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  })

  const handleChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem('language', JSON.stringify(value))
    if(value == "Tiếng Việt") {
      localStorage.setItem('code_language', JSON.stringify("vi-VN"))
    } else {
      localStorage.setItem('code_language', JSON.stringify("en-US"))
    }
    window.location.reload();
  };

  const openDrawer = (): void => {
    setOpen(true)
  }

  const closeDrawer = (): void => {
    setOpen(false)
  }

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

  const Logout = () => {
    const body = {
      language: null,
      refresh_token: refresh_token
    }
    fetch('http://localhost:3000/api/users/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json()
    }).then((data) => {
      console.log(data)
      messageApi.open({
        type: 'success',
        content: 'Đăng nhập thành công',
        style: {
          marginTop: '10vh',
        },
      })
    })
  }
  
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button
          className='flex gap-2 items-center'
        ><FaRegUserCircle /> Thông tin tài khoản</button>
      ),
    },
    {
      key: '2',
      label: (
        <button
          onClick={() => Logout()}
          className='flex gap-2 items-center'
        ><IoLogOutOutline /> Đăng xuất</button>
      ),
    },
  ];

  const style = {
    background: 'rgba(245, 245, 245, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)', // React yêu cầu `-webkit-` đổi thành `Webkit`
    border: '1px solid rgba(245, 245, 245, 0.3)',
  };

  return (
    <>
      <div className='sticky top-0 z-50 navbarName' style={style}>
      {contextHolder}
      <div className="p-2 lg:text-xl flex xl:justify-around justify-between">
        {/* logo */}
        <div className='flex items-center font-bold cursor-pointer'>
          <div onClick={() => navigate("/")} className='flex items-center text-black gap-2.5'>
            <img src="/images/system/logo tank food.png" className='w-16' alt="logo" /> 
            <p>Tank<span className='text-[#ffcc00]'>Food</span></p>
          </div>
        </div>
        <div className='hidden xl:block px-6 py-2'>
          <ul className='flex items-center gap-5'>
            {(
              // Thanh nav cho nhân viên 
              role == 1 ? NavbarUser.map((item: NavbarItem) => {
                  return <li key={item.id} className="text-xl">
                            <button onClick={() => navigate(item.path)}
                                    className="links cursor-pointer font-semibold text-[#FF6B35] p-2 rounded-md transition duration-300">
                                    {language == "Tiếng Việt" ? item.title : item.english}</button> 
                          </li>
                    // Thanh nav cho shipper
              }) : (role == 2 ? NavbarUser.map((item: NavbarItem) => {
                  return <li key={item.id} className="text-xl">
                            <button onClick={() => navigate(item.path)}
                                    className="links cursor-pointer font-semibold text-[#FF6B35] p-2 rounded-md transition duration-300">
                                    {language == "Tiếng Việt" ? item.title : item.english}</button> 
                          </li>}) : NavbarUser.map((item: NavbarItem) => {
                    // Thanh nav cho khách hàng
                  return <li key={item.id} className="text-xl">
                            <button onClick={() => navigate(item.path)}
                                    className="links cursor-pointer font-semibold text-[#FF6B35] p-2 rounded-md transition duration-300">
                                    {language == "Tiếng Việt" ? item.title : item.english}</button> 
                          </li>
                      })
                  )
                )
            }
          </ul>
        </div>
        <div className='flex items-center gap-10'>
          <div className='flex items-center'>
            <Select
              defaultValue={language}
              size='large'
              style={{ color: '#FF9A3D' }}
              options={[
                { value: 'Tiếng Việt', label: 'Tiếng Việt' },
                { value: 'English', label: 'English' },
              ]}
              onChange={handleChange}
            />
          </div>
          {
            refresh_token !== null
            ?  // <Popover content="Nam đen" className='cursor-pointer text-lg'>
            //       <Avatar size="large" icon={<FaUserCircle />} />
            //     </Popover>
            <Dropdown menu={{ items }} 
                      placement="bottom" 
                      arrow>
              <Button
                className='p-10'
              ><MdAccountBox /> {language == "Tiếng Việt" ? "Tài khoản" : "User account"}</Button>
            </Dropdown>
            : 
            <button className='flex items-center gap-2.5 cursor-pointer hover:bg-[#FF9A3D] hover:text-[#ffffff] transition duration-200 text-[#FF9A3D] rounded-full font-semibold border-2 border-[#FF9A3D] px-6 py-2' 
                onClick={() => navigate("/signup")}><IoIosLogIn />{language == "Tiếng Việt" ? "Đăng nhập" : "Login"}
            </button>
          }
          <div className='xl:hidden px-4 py-2 bg-[#FF6B35] rounded-full text-[#ffffff]'>
            <button onClick={openDrawer}><IoMenu /></button>
          </div>
          <Drawer title="TankFood" onClose={closeDrawer} open={open}>
            <div className='w-full'>
              <ul className='flex items-center flex-col gap-5'>
                {
                  NavbarUser.map((item: NavbarItem) => {
                    return <li key={item.id} className="text-xl">
                              <button onClick={() => navigate(item.path)}
                                      className="links cursor-pointer font-semibold text-[#FF6B35] p-2 rounded-md transition duration-300">
                                      {language == "Tiếng Việt" ? item.title : item.english}</button> 
                              <Divider my="md" />
                            </li>
                  })
                }
              </ul>
            </div>
          </Drawer>
        </div>
        {/* Thanh nav responsive */}
      </div>
      </div>
    </>
  );
}

function Main(): JSX.Element {
  const Slideshow = (): JSX.Element => {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      AOS.init({
        duration: 1000, // Thời gian hiệu ứng (ms)
        offset: 100, // Khoảng cách kích hoạt hiệu ứng (px)
        once: false,
        mirror: true,
      });
    }, []);
    
    const slides: Slide[] = [
      { src: "/images/system/1.png", alt: "Slide 1", effect: "fade-zoom" },
      { src: "/images/system/2.png", alt: "Slide 2", effect: "fade" },
      { src: "/images/system/3.png", alt: "Slide 3", effect: "slide" },
      { src: "/images/system/4.png", alt: "Slide 4", effect: "fade" }
    ];
  
    // Hiển thị slideshow tự động
    const showSlides = (): void => {
      let newIndex = slideIndex + 1;
      if (newIndex >= slides.length) {
        newIndex = 0;
      }
      setSlideIndex(newIndex);
    };
  
    // Chuyển đến slide cụ thể
    const currentSlide = (index: number): void => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      setSlideIndex(index);
    };
  
    // Thay đổi slide khi nhấn nút prev/next
    const changeSlide = (direction: number): void => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      
      let newIndex = slideIndex + direction;
      
      if (newIndex >= slides.length) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = slides.length - 1;
      }
      
      setSlideIndex(newIndex);
    };
  
    // Thiết lập và xóa timer
    useEffect(() => {
      slideTimerRef.current = setTimeout(showSlides, 10000);
      
      return () => {
        if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      };
    }, [slideIndex, showSlides]);
  
    // Tạo hiệu ứng dựa trên loại - Enhanced with new effects
    const getEffectClasses = (index: number, effect: string): string => {
      const baseClasses = 'absolute w-full h-full transition-all duration-1000 ease-in-out transform';
      const activeClasses = index === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0';
      
      let effectClasses = '';
      if (index === slideIndex) {
        switch (effect) {
          case 'zoom':
            effectClasses = 'scale-105';
            break;
          case 'fade-zoom': // New enhanced effect for slide 1
            effectClasses = 'scale-110';
            break;
          case 'slide':
            effectClasses = 'translate-x-0';
            break;
          default:
            effectClasses = '';
        }
      } else {
        switch (effect) {
          case 'slide':
            effectClasses = index < slideIndex ? '-translate-x-full' : 'translate-x-full';
            break;
          case 'fade-zoom': // Add exit animation for the new effect
            effectClasses = 'scale-100';
            break;
          default:
            effectClasses = '';
        }
      }
      
      return `${baseClasses} ${activeClasses} ${effectClasses}`;
    };
  
    return (
      <div className="flex flex-col items-center mb-16 w-full">
        {/* Slideshow container */}
        <div className="relative max-w-340 h-170 w-full mx-auto my-10 overflow-hidden rounded-lg shadow-2xl aspect-[16/9]">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={getEffectClasses(index, slide.effect)}
            >
              <img 
                src={slide.src} 
                alt={slide.alt} 
                className={`w-full h-full object-cover transition-transform duration-3000 ease-in-out ${
                  index === slideIndex && slide.effect === 'fade-zoom' 
                    ? 'scale-100 animate-pulse-subtle' 
                    : index === slideIndex && slide.effect === 'zoom'
                    ? 'scale-100'
                    : 'scale-100'
                }`}
              />
            </div>
          ))}
          
          {/* Nút điều hướng trái */}
          <button 
            className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-20 focus:outline-none"
            onClick={() => changeSlide(-1)}
          >
            &#10094;
          </button>
          
          {/* Nút điều hướng phải */}
          <button 
            className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-20 focus:outline-none"
            onClick={() => changeSlide(1)}
          >
            &#10095;
          </button>
        </div>
  
        {/* Điểm điều hướng */}
        <div className="flex justify-center mt-[-80px] mb-10 z-50">
          {slides.map((_, index) => (
            <span 
              key={index}
              className={`inline-block h-3 w-3 mx-1 rounded-full cursor-pointer border-1 border-[#ffffff] transition-colors ${
                index === slideIndex ? 'bg-[#ff9b42]' : 'bg-transparent hover:bg-[#ff9b42]'
              }`}
              onClick={() => currentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    );
  };

  return (
      <>
        <style>{`
          .blur-text {
            animation: blurText 1.5s ease-in-out;
          }
          @keyframes blurText {
            0% {
              filter: blur(0px);
            }
            100% {
              filter: blur(4px);
            }
          }
        `}</style>
        <Slideshow />
          {/* Wrapper với nền aura phù hợp với chủ đề đồ ăn nhanh */}
        <div className="bg-gradient-to-b from-[#FFE5B4] to-[#92e2fb] relative overflow-hidden">
          {/* Hiệu ứng aura */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiNGRkI4MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
          
          {/* Phần Nâng tầm bữa ăn */}
          <div className="flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up" data-aos-duration="1000">
            <div className="relative w-full md:w-1/3 flex justify-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="relative transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
                {/* Khung tròn với đường viền */}
                <div className="w-72 h-72 rounded-full border-4 border-[#FFB800] p-2 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-[#FF7846]">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FF7846]/30 transition-all duration-300 hover:border-[#FFB800]">
                    <img 
                      src="/images/system/Hamburger_trangchu.jpg" 
                      alt="Burger đặc biệt" 
                      className="w-full h-full object-cover rounded-full transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                </div>
                <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6 text-[#FFB800] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 mt-8 md:mt-0 text-center md:text-left" data-aos="fade-left" data-aos-delay="500">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto">
                <span className="text-[#654321]">Nâng </span>
                <span className="text-[#FF7846]">cao </span>
                <span className="text-[#654321]">bữa ăn</span>
              </h2>
              <p className="text-[#654321] mb-6 max-w-xl font-roboto">
                Bạn sẽ tìm thấy nhiều thông tin về cách nâng cao trải nghiệm ẩm thực của bạn. Có rất nhiều cách để chế biến một bữa ăn tuyệt vời tại TankFood. Tất cả những gì bạn cần là nguyên liệu phù hợp, vai trò nấu nướng và một chút sáng tạo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-[#FF7846] hover:bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-roboto shadow-md hover:shadow-lg hover:translate-y-[-3px] hover:px-8">
                  Đặt hàng ngay
                </button>
                <button className="border-2 border-[#654321] text-[#654321] hover:bg-[#654321] hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-roboto shadow-md hover:shadow-lg hover:translate-y-[-3px]">
                  Xem thực đơn
                </button>
              </div>
            </div>
          </div>

          {/* Phần Danh mục nổi bật */}
          <div className="py-16 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-center mb-8 font-roboto" data-aos="zoom-in">
              <span className="text-[#654321]">Danh mục </span>
              <span className="text-[#FF7846]">nổi bật</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="100">
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                  <img 
                    src="/images/system/Hamburger_trangchu2.jpg" 
                    alt="Bánh mì kẹp thịt" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">Bánh mì kẹp thịt</h3>
                <p className="text-sm text-gray-500 text-center font-roboto">Đa dạng hương vị</p>
              </div>
              
              <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="200">
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                  <img 
                    src="/images/system/Khoaitaychien_trangchu.jpg" 
                    alt="Khoai tây chiên" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">Khoai tây chiên</h3>
                <p className="text-sm text-gray-500 text-center font-roboto">Giòn tan hấp dẫn</p>
              </div>
              
              <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="300">
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                  <img 
                    src="/images/system/garan_trangchu.jpg" 
                    alt="Gà rán" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">Gà rán</h3>
                <p className="text-sm text-gray-500 text-center font-roboto">Thơm ngon đặc biệt</p>
              </div>
              
              <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="400">
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                  <img 
                    src="/images/system/nuocuong_trangchu.jpg" 
                    alt="Thức uống" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">Thức uống</h3>
                <p className="text-sm text-gray-500 text-center font-roboto">Giải khát sảng khoái</p>
              </div>
            </div>
          </div>

          {/* Phần Nấu Ăn */}
          <div className="py-16 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-medium text-[#654321] font-roboto" data-aos="fade-up">MÓN ĂN NGON</h3>
              <h2 className="text-5xl font-bold text-[#FF7846] mt-2 font-roboto" data-aos="zoom-in" data-aos-delay="200">GIÁ TUYỆT VỜI</h2>
              <p className="text-[#654321] max-w-2xl mx-auto mt-4 font-roboto" data-aos="fade-up" data-aos-delay="400">
                Khám phá các món ăn tuyệt vời của chúng tôi, được tạo ra để giúp bạn tìm đúng công thức cho bữa ăn hoàn hảo tại TankFood.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-right" data-aos-delay="100">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="/images/system/burgerdacbiet.jpg" 
                    alt="Burger Đặc Biệt" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#654321] font-roboto">Burger Đặc Biệt</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[#FF7846] font-bold font-roboto">89.000 ₫</span>
                    <button className="bg-[#FF7846] hover:bg-[#FF6B35] text-white text-sm py-1 px-3 rounded-full transition-all duration-300 font-roboto shadow-sm hover:shadow-md hover:px-4">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-up" data-aos-delay="200">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="/images/system/khoaiphomai.jpg" 
                    alt="Khoai Phô Mai" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#654321] font-roboto">Khoai Phô Mai</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[#FF7846] font-bold font-roboto">49.000 ₫</span>
                    <button className="bg-[#FF7846] hover:bg-[#FF6B35] text-white text-sm py-1 px-3 rounded-full transition-all duration-300 font-roboto shadow-sm hover:shadow-md hover:px-4">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-left" data-aos-delay="300">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="/images/system/garansotthai.jpg" 
                    alt="Gà Rán Giòn" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#654321] font-roboto">Gà Rán Giòn</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[#FF7846] font-bold font-roboto">79.000 ₫</span>
                    <button className="bg-[#FF7846] hover:bg-[#FF6B35] text-white text-sm py-1 px-3 rounded-full transition-all duration-300 font-roboto shadow-sm hover:shadow-md hover:px-4">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phần Combo Gia Đình */}
          <div className="py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-[#FF9A3D] to-[#FF6B35] text-white rounded-lg mx-4 md:mx-8 lg:mx-16 my-16 relative overflow-hidden shadow-lg border border-[#FFB800]/30 transition-transform duration-300 hover:shadow-2xl hover:scale-[1.01]" data-aos="zoom-in-up">
            <div className="absolute top-2 right-2 bg-white text-[#FF6B35] font-bold py-1 px-3 rounded-full text-sm font-roboto shadow-md">-20%</div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-roboto" data-aos="fade-right" data-aos-delay="200">Combo Gia Đình</h2>
            <p className="mb-6 max-w-2xl font-roboto" data-aos="fade-right" data-aos-delay="300">
              Đặt combo gia đình cho 4 người chỉ với 299.000₫. Gồm 4 burger, 2 phần khoai tây, 4 món tráng miệng và 4 nước uống.
            </p>
            
            <button className="bg-white text-[#FF6B35] hover:bg-gray-100 font-bold py-2 px-6 rounded-full transition-all duration-300 font-roboto shadow-md hover:shadow-lg hover:translate-y-[-3px] hover:px-8" data-aos="fade-up" data-aos-delay="400">
              Đặt Ngay
            </button>
            
            <div className="absolute right-0 top-0 opacity-20">
              <img 
                src="/images/system/combogiadinh.jpg" 
                alt="Family combo meal with burgers" 
                className="h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>

          {/* Phần Call to Action */}
          <div className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#9ee8ff] to-[#FFE5B4] text-center relative z-10 shadow-inner" data-aos="fade-up">
            <div className="absolute top-8 left-1/4 text-[#FFB800] animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
              </svg>
            </div>
            
            <h3 className="text-4xl font-bold text-[#654321] mb-2 font-stretch-semi-condensed blur-text" data-aos="fade-up" data-aos-delay="200">Vẫn còn đói?</h3>
            <h2 className="text-6xl font-bold text-[#FF7846] mb-12 font-roboto blur-text" data-aos="zoom-in" data-aos-delay="400">ĐẶT THÊM NGAY</h2>
            
            <button className="bg-[#FF7846] hover:bg-[#FF6B35] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg font-roboto shadow-lg hover:shadow-xl hover:translate-y-[-5px] hover:px-10" data-aos="fade-up" data-aos-delay="600">
              Đặt hàng ngay
            </button>
            
            <div className="absolute bottom-8 right-1/4 text-[#FFB800] animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
}
export default FormMain;