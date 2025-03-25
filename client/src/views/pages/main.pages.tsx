import { NavbarUser } from '../components/navbar_component.tsx';
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer , Select } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from 'react'
import Signup from './signup.pages.tsx';
import { Divider  } from '@mantine/core';
import Category from './category.management.pages.tsx';
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

  // window.location.reload()
  const [loading, setLoading] = useState<boolean>(true)
  const location = useLocation();
  const pageRef = useRef(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserInfo | null>(null)
  // const body1 = {
  //   language: null,
  //   refresh_token: refresh_token
  // }
  // fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-token`, {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token}`,
  //   },
  //   body: JSON.stringify(body1)
  // }).then(response => { return response.text() }).then((data) => {
  //   console.log(data)
  // })

  const [language, setLanguage] = useState<string>(() => {
    const SaveedLanguage = localStorage.getItem('language')
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  })
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
    <>
      {/* {user && user.role == 3 ? 
        <div className='flex' ref={pageRef}>
          <NavigationAdmin displayname={user.display_name}/>
          <Routes>
            <Route path="/*" element={<MainManage />} />
          </Routes>
        </div> : 
        <div className='flex gap-5 flex-col' ref={pageRef}>
          <NavigationButtons role={user?.role ?? 0}/>
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/menu' element={<Category />}/>
            <Route path='/contact' element={<ContactUs />}/>
            <Route path='/category' element={<CategoryManagement />}/>
          </Routes>
        </div>} */}

        {loading ? <Loading /> : (user && user.role == 3 ? 
          <div className='flex relative'>
            <NavigationAdmin displayname={user.display_name}/>
            <div className='absolute right-0 top-0 gap-5 flex items-center p-10 z-40'>
              <Select
                defaultValue={language}
                size='small'
                options={[
                  { value: 'Tiếng Việt', label: 'Tiếng Việt - VI' },
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
            <Routes>
              <Route path="/*" element={<MainManage />} />
              <Route path="/Account" element={<Account />} />
              <Route path='/category' element={<CategoryManagement />}/>
              <Route path='/order' element={<OrderManagement />}/>
              <Route path='/product' element={<ProductManagement />}/>
              <Route path='/ship' element={<ShipManagement />}/>
              <Route path='/discount' element={<DiscountCodeManagement />}/>
            </Routes>
          </div> : 
          <div className='flex gap-5 flex-col' ref={pageRef}>
            <NavigationButtons role={user?.role ?? 0}/>
            <Routes>
              <Route path="/*" element={<Main />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/signup" element={<Signup />} />
              <Route path='/menu' element={<Category />}/>
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
            <img src="/public/images/system/logo tank food.png" className='w-16' alt="logo" /> 
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
    }, [slideIndex]);
  
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
        <Slideshow />
      </>
    );
}

export default FormMain