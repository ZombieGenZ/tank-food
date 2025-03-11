import Loading from '../components/loading_page_components.tsx'
import { Navbar } from '../components/navbar_component.tsx';
import { IoFastFood } from "react-icons/io5";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import Signup from './signup.pages.tsx';

const FormMain = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1500)
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

  return (
    <div className='sticky top-0 bg-[#FF6B35]'>
      <div className="p-4 text-2xl flex justify-evenly">
        {/* logo */}
        <div className='flex items-center font-bold cursor-pointer'>
          <p onClick={() => navigate("/")} className='text-[#ffffff] flex gap-2.5'>
            <IoFastFood /> 
            <p className='text-[#ffffff]'>Tank<span className='text-[#ffcc00]'>Food</span></p>
          </p>
        </div>
        <div>
          <ul className='flex items-center gap-10'>
            {
              Navbar.map((item) => {
                return <li key={item.id} className='text-[#ffffff] cursor-pointer'>
                        <button onClick={() => navigate(item.path)}>{item.title}</button> 
                      </li>
              })
            }
          </ul>
        </div>
        <div className='flex items-center cursor-pointer'>
          <button className='text-[#ffffff]' onClick={() => navigate("/signup")}>Đăng nhập</button>
        </div>
      </div>
      {/* <button onClick={() => navigate("/signup")}>Đăng nhập</button> */}
    </div>
  );
}

function Main() {
  return (
    <p>đây là trang chủ</p>
  )
}

export default FormMain