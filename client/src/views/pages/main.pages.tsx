import { NavbarUser, NavbarAdmin } from '../components/navbar_component.tsx';
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer , Select } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from 'react'
import Signup from './signup.pages.tsx';
import { Divider  } from '@mantine/core';
import Category from './category.management.pages.tsx';
import CategoryManagement from './CategoryManagement.pages.tsx';
import ContactUs from './contact.pages.tsx';
import { Dropdown, Button } from "antd";
import { message } from 'antd';
import '/public/css/main.css'
import { gsap } from 'gsap';
import type { MenuProps } from 'antd';
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdAccountBox } from "react-icons/md";

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
  const location = useLocation();
  const pageRef = useRef(null);

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
        <div className='flex gap-5 flex-col' ref={pageRef}>
          <NavigationButtons />
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/menu' element={<Category />}/>
            <Route path='/contact' element={<ContactUs />}/>
            <Route path='/category' element={<CategoryManagement />}/>
          </Routes>
        </div>
  )   
}

function NavigationAdmin(): JSX.Element {
  return (
    <>
      
    </>
  )
}

function NavigationButtons(): JSX.Element {
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
  const [user, setUser] = useState<UserInfo | null>(null)

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
  
    fetch("http://localhost:3000/api/users/get-user-infomation", {
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
  return (
    <>
      {user?.role === 3}
      <div className='sticky top-0 z-50 navbarName'>
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
            {/* { user.role == 3 */}
            { user !== null &&
                    // Thanh nav cho Admin
                    user.role == 3 ? NavbarAdmin.map((item: NavbarItem) => {
                  return <li key={item.id}>
                          <button className="links cursor-pointer font-semibold text-[#FF6B35] px-4 py-2 rounded-md transition duration-300"
                                  onClick={() => navigate(item.path)}>{language == "Tiếng Việt" ? item.title : item.english}</button> 
                        </li>
                    // Thanh nav cho nhân viên
              }) : (user !== null && user.role == 1 ? NavbarUser.map((item: NavbarItem) => {
                  return <li key={item.id} className="text-xl">
                            <button onClick={() => navigate(item.path)}
                                    className="links cursor-pointer font-semibold text-[#FF6B35] p-2 rounded-md transition duration-300">
                                    {language == "Tiếng Việt" ? item.title : item.english}</button> 
                          </li>
                    // Thanh nav cho shipper
              }) : (user !== null && user.role == 2 ? NavbarUser.map((item: NavbarItem) => {
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
      { src: "/public/images/system/1.png", alt: "Slide 1", effect: "fade-zoom" },
      { src: "/public/images/system/2.png", alt: "Slide 2", effect: "fade" },
      { src: "/public/images/system/3.png", alt: "Slide 3", effect: "slide" },
      { src: "/public/images/system/4.png", alt: "Slide 4", effect: "fade" }
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