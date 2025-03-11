import Loading from '../components/loading_page_components.tsx'
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
    <div className='flex justify-evenly'>
      <button onClick={() => navigate("/signup")}>Đăng nhập</button>
    </div>
  );
}

export default FormMain