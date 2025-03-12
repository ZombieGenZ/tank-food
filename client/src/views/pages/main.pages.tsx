import Loading from '../components/loading_page_components.tsx'
import { Navbar } from '../components/navbar_component.tsx';
import { IoFastFood } from "react-icons/io5";
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import Signup from './signup.pages.tsx';

const FormMain = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation()

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

function NavigationButtons() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    setOpen(true)
  }

  const closeDrawer = () => {
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
              Navbar.map((item) => {
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
                  Navbar.map((item) => {
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

function Main() {
  
  return (
    <div>
      
    </div>
  )
}

export default FormMain