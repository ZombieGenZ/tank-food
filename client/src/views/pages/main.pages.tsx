import Loading from '../components/loading_page_components.tsx'
import { Navbar } from '../components/navbar_component.tsx';
import { IoFastFood } from "react-icons/io5";
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from 'react'
import Signup from './signup.pages.tsx';

// Define the Navbar item type
interface NavbarItem {
  id: number;
  title: string;
  path: string;
}

// Define the slide type for the slideshow
interface Slide {
  src: string;
  alt: string;
  effect: "zoom" | "fade" | "slide" | "fade-zoom";
}

const FormMain = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [location.pathname])

  return(
    <>
      {
        loading ? <Loading /> : 
        <div>
          <NavigationButtons />
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      }
    </>
  )   
}

function NavigationButtons(): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const openDrawer = (): void => {
    setOpen(true)
  }

  const closeDrawer = (): void => {
    setOpen(false)
  }

  return (
    <div className='sticky top-0 z-50 bg-white'>
      <div className="p-2 lg:text-xl flex md:justify-around justify-between">
        {/* logo */}
        <div className='flex items-center font-bold cursor-pointer'>
          <p onClick={() => navigate("/")} className='flex items-center text-black gap-2.5'>
            <IoFastFood /> 
            <p>Tank<span className='text-[#ffcc00]'>Food</span></p>
          </p>
        </div>
        <div className='hidden md:block px-6 py-2'>
          <ul className='flex items-center gap-10'>
            {
              Navbar.map((item: NavbarItem) => {
                return <li key={item.id}>
                        <button className="cursor-pointer font-semibold text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white px-4 py-2 rounded-md  transition duration-300"
                                onClick={() => navigate(item.path)}>{item.title}</button> 
                      </li>
              })
            }
          </ul>
        </div>
        <div className='flex items-center gap-4'>
          <button className='flex items-center gap-2.5 cursor-pointer hover:bg-[#FF9A3D] hover:text-[#ffffff] transition duration-200 text-[#FF9A3D] rounded-full font-semibold border-2 border-[#FF9A3D] px-6 py-2' 
                  onClick={() => navigate("/signup")}><IoIosLogIn /> Đăng nhập</button>
          <div className='md:hidden'>
            <button onClick={openDrawer}><IoMenu /></button>
          </div>
          <Drawer title="Basic Drawer" onClose={closeDrawer} open={open}>
            <div className='w-full'>
              <ul className='flex items-center flex-col gap-10'>
                {
                  Navbar.map((item: NavbarItem) => {
                    return <li key={item.id}>
                            <button onClick={() => navigate(item.path)}
                                    className="cursor-pointer font-semibold text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white px-4 py-2 rounded-md transition duration-300">{item.title}</button> 
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
      <div className="flex flex-col items-center mb-16">
        {/* Slideshow container */}
        <div className="relative max-w-300 h-150 w-full mx-auto my-10 overflow-hidden rounded-lg shadow-2xl aspect-[16/9]">
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
        <div className="flex justify-center mt-5 mb-10">
          {slides.map((_, index) => (
            <span 
              key={index}
              className={`inline-block h-3 w-3 mx-1 rounded-full cursor-pointer transition-colors ${
                index === slideIndex ? 'bg-gray-800' : 'bg-gray-400 hover:bg-gray-600'
              }`}
              onClick={() => currentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    );
  };

  return <Slideshow />;
}

export default FormMain