import Loading from '../components/loading_page_components.tsx'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import Signup from './signup.pages.tsx';

const FormMain = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  return(
    <>
      {
        loading ? <Loading /> : 
        <BrowserRouter>
          <div>
            <NavigationButtons />
            <Routes>
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </BrowserRouter>
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