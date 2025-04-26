import { NavbarUser, NavbarEmployee, NavbarShipper, Customer } from '../components/navbar_component.tsx';
import { IoIosLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, JSX,Dispatch, SetStateAction } from 'react';
import Signup from './signup.pages.tsx';
import { Divider } from '@mantine/core';
import Menu from './category.management.pages.tsx';
import SealPage from './Seal.pages.tsx';
import CategoryManagement from './CategoryManagement.pages.tsx';
import ProductManagement from './Product.pages.tsx';
import ShipManagement from './ShipManagement.pages.tsx';
import ContactUs from './contact.pages.tsx';
import DiscountCodeManagement from './Discount.pages.tsx';
import OrderManagement from './Order.psges.tsx';
import MainManage from './Main.management.pages.tsx';
import MyCard from './MyCard.pages.tsx';
import OrderPageWithPayment from './Payment.pages.tsx';
import ChangePassword from './ChangePassword.pages.tsx';
import VoucherPrivate from './VoucherPrivate.pages.tsx';
import AlertBanner from '../components/Banner.components.tsx';
import NotFoundPage from './NotFound.pages.tsx';
import ResultVerifyAccount from './ResultVerifyAccount.pages.tsx';
import { Dropdown, Button } from "antd";
import { message, Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { gsap } from 'gsap';
import type { MenuProps } from 'antd';
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import Loadings from '../components/loading_page_components.tsx';
import Loading from '../components/loading.components.tsx';
import ProfilePage from './Profile.pages.tsx';
import Aboutus from './aboutus.pages.tsx';
import Account from './Account.management.pages.tsx';
import { RiUser3Line, RiHome5Line, RiShoppingCart2Line, RiTruckLine, RiPriceTag3Line, RiShoppingBag3Line } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IconType } from "react-icons";
import AOS from "aos";
import { Calendar } from 'lucide-react';
import { IoSettings } from "react-icons/io5";
import "aos/dist/aos.css";
import { FaUserAlt } from "react-icons/fa";
import { RESPONSE_CODE } from '../../constants/responseCode.constants.ts';
import Verify from '../components/VerifyToken.components.tsx';
import { MdManageAccounts } from "react-icons/md";
import io from "socket.io-client";
import NotificationButton from '../components/notification-button.tsx';

const socket = io(import.meta.env.VITE_API_URL)

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

interface NavbarItem {
  id: number;
  title: string;
  english: string;
  path: string;
}

interface Slide {
  src: string;
  alt: string;
  effect: "zoom" | "fade" | "slide" | "fade-zoom";
}

interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  priceAfterdiscount: number; 
  discount: number
}

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormMain = (): JSX.Element => {
  const language = (): string => {
    const language = localStorage.getItem('language')
    return language ? JSON.parse(language) : "Tiếng Việt"
  }
  // const navigate = useNavigate()
  const [loadingCP, setLoadingCP] = useState<boolean>(false)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cartlocal = localStorage.getItem('my_cart')
    return cartlocal ? JSON.parse(cartlocal) : []
  });
  const MAX_NOTIFICATIONS = 5; // Giới hạn 5 thông báo

const [notification, setNotification] = useState<string[]>(() => {
  const savedNotifications = localStorage.getItem('notification');
  return savedNotifications ? JSON.parse(savedNotifications) : [];
});

// Hàm thêm thông báo mới với giới hạn
const addNotification = (newMessage: string) => {
  setNotification(prev => {
    const updatedNotifications = [...prev, newMessage];
    const limitedNotifications = updatedNotifications.slice(-MAX_NOTIFICATIONS); // Giữ lại 5 thông báo mới nhất
    localStorage.setItem('notification', JSON.stringify(limitedNotifications)); // Lưu vào localStorage
    return limitedNotifications;
  });
};

  const addToCart = (item: { id: string; name: string; price: number; image: string; priceAfterdiscount: number; discount: number }) => {
    if(refresh_token == null) {messageApi.error("Vui lòng đăng nhập để lưu món vào giỏ hàng !"); return};
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) { 
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    messageApi.success(`Thêm ${item.name} vào giỏ hàng thành công !`)
    addNotification(`Thêm ${item.name} vào giỏ hàng thành công !`)
  };

  useEffect(() => {
    localStorage.setItem('my_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    socket.emit('connect-user-realtime', refresh_token)
    socket.on('verify-account', (res: { user_id: string }) => {
      messageApi.success("Tài khoản được xác thực thành công !");
      setUser((prev) => {
        if (prev) {
          return { ...prev, _id: res.user_id, user_type: 1 };
        } else {
          return { _id: res.user_id, user_type: 1, created_at: "", display_name: "", email: "", penalty: null, phone: "", role: 0, updated_at: "" };
        }
        });
      })

    socket.on('logout', (res) => {
      // localStorage.removeItem('refresh_token')
      // localStorage.removeItem('access_token')
      console.log(res)
      messageApi.open({
        type: 'success',
        content: `Tài khoản ${res._id} đã đăng xuất thành công !`,
      });
    })

    socket.on('create-order-booking', (res) => {
      messageApi.open({
        type: 'success',
        content: `Đơn hàng ${res._id} đã được đặt thành công!`,
      });
      addNotification(`Đơn hàng ${res._id} đã được đặt thành công!`);
    })

    socket.on('ban' , (res) => {
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('access_token')
      messageApi.open({
        type: 'error',
        content: `Tài khoản của bạn đã bị ban vì lý do "${res.reason}"!`,
      })

      addNotification(`Tài khoản của bạn đã bị ban vì lý do "${res.reason}"!`);
    })

    socket.on('checkout-order-booking', (res) => {
      messageApi.open({
        type: 'success',
        content: `Đơn hàng ${res._id} đã được thanh toán thành công!`,
      });

      addNotification(`Đơn hàng ${res._id} đã được thanh toán thành công!`);
    })

    socket.on('approval-order-booking', (res) => {
      if(res.order_status == 5) {
        messageApi.open({
          type: 'error',
          content: `Đơn hàng ${res._id} đã bị huỷ hoặc bị từ chối với lý do ${res.cancellation_reason}!`,
        });
  
        addNotification(`Đơn hàng ${res._id} đã bị huỷ hoặc bị từ chối với lý do ${res.cancellation_reason}!`);
        return
      }
      messageApi.open({
        type: 'success',
        content: `Đơn hàng ${res._id} đã được duyệt thành công!`,
      });

      addNotification(`Đơn hàng ${res._id} đã được duyệt thành công!`);
    })

    socket.on('complete-order-booking', (res) => {
      messageApi.open({
        type: 'success',
        content: `Đơn hàng ${res._id} đã được hoàn thành!`,
      });

      addNotification(`Đơn hàng ${res._id} đã được hoàn thành!`);
    })

    socket.on('cancel-order-booking', (res) => {
      messageApi.open({
        type: 'error',
        content: `Đơn hàng ${res._id} đã bị hủy!`,
      });

      addNotification(`Đơn hàng ${res._id} đã bị hủy!`);
    })

    socket.on('delivery-order', (res) => {
      messageApi.open({
        type: 'success',
        content: `Đơn hàng ${res._id} đang được giao đến chỗ bạn!`,
      });

      addNotification(`Đơn hàng ${res._id} đang được giao đến chỗ bạn!`);
    })

    socket.on('cancel-delivery', (res) => {
      messageApi.open({
        type: 'error',
        content: `Đơn hàng ${res._id} đã bị hủy giao hàng!`,
      });

      addNotification(`Đơn hàng ${res._id} đã bị hủy giao hàng!`);
    })

    return () => {
      socket.off('verify-account')
      socket.off('logout')
      socket.off('create-order-booking')
      socket.off('ban')
      socket.off('checkout-order-booking')
      socket.off('approval-order-booking')
      socket.off('complete-order-booking')
      socket.off('cancel-order-booking')
      socket.off('delivery-order')
      socket.off('cancel-delivery')
    }
  })

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const AdminView = localStorage.getItem('isAdminView')
    return AdminView ? JSON.parse(AdminView) : true
  }); // Mặc định là Admin view
  const [messageApi, contextHolder] = message.useMessage();

  function NavAdmin({ display_name, notification }: { display_name: string; notification: string[] }) {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<string>(() => {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage ? JSON.parse(savedLanguage) : "Tiếng Việt";
    });

    const checkTokenRouter = (router: string) => {
      const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
          if (isValid) {
            navigate(router)
          } else {
            messageApi.error(language == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
          }
      };
      checkToken()
    }

    const handleChange = (value: string) => {
      setLanguage(value);
      localStorage.setItem('language', JSON.stringify(value));
      if (value === "Tiếng Việt") {
        localStorage.setItem('code_language', JSON.stringify("vi-VN"));
      } else {
        localStorage.setItem('code_language', JSON.stringify("en-US"));
      }
      window.location.reload();
    };

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <button className='flex cursor-pointer gap-2 items-center' onClick={() => navigate('/profile')}>
            <FaRegUserCircle /> Thông tin tài khoản
          </button>
        ),
      },
      {
        key: '2',
        label: (
          <button className="flex cursor-pointer gap-2 items-center" onClick={() => {localStorage.setItem('isAdminView', JSON.stringify(false)); setIsAdminView(false); checkTokenRouter('/')}}>
            <FaHome /> {language === "Tiếng Việt" ? "Trang chủ" : "Main User"}
          </button>
        ),
      },
      {
        key: '3',
        label: (
          <button className='flex cursor-pointer gap-2 items-center' onClick={() => Logout()}>
            <IoLogOutOutline /> Đăng xuất
          </button>
        ),
      },
    ];

    const Logout = () => {
      const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
          if (isValid) {
            try {
              setLoading(true)
              const body = {
                language: null,
                refresh_token: refresh_token,
              };
              fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(body),
              })
                .then((response) => response.json())
                .then((data) => {
                  if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                    messageApi.error(data.message)
                    if (data.errors) {
                      for (const key in data.errors) {
                        if (data.errors[key] && data.errors[key].msg) {
                          messageApi.error(data.errors[key].msg);
                        }
                      }
                    }
                    return;
                  }
                  if (data.code === RESPONSE_CODE.USER_LOGOUT_SUCCESSFUL) {
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('access_token');
                    messageApi.open({
                      type: 'success',
                      content: 'Đăng xuất thành công',
                      style: {
                        marginTop: "10vh",
                      }, 
                    }).then(() => {
                      localStorage.setItem('isAdminView', JSON.stringify(false))
                      window.location.reload()
                    }).then(() => { 
                      navigate('/')
                    })
                  } else {
                    messageApi.error(data.message)
                    return
                  }
                });
            } catch (error) {
              messageApi.error(String(error))
              return;
            } finally {
              setTimeout(() => {
                setLoading(false)
              }, 6000)
            }
          } else {
            messageApi.error(language == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
          }
      };
      checkToken();
    };

    const date = new Date().toISOString()

    function formatDateFromISO(isoDateString: string): string {
      const date = new Date(isoDateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
      // Kiểm tra nếu đang chạy trên client
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
        
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);

    return (
      <div className="bg-white sticky z-30 top-0 shadow-sm p-4 flex justify-end lg:justify-between items-center">
        {contextHolder}
        {windowWidth >= 400 && <h1 className="invisible lg:visible text-xl font-bold text-slate-900">{display_name}</h1>}
        <div className="flex items-center gap-5 pr-2">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <span className="text-sm text-gray-500">{formatDateFromISO(date)}</span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className={`p-1 md:p-2 cursor-pointer underline rounded-md bg-orange-500 text-white text-xs md:text-base`}
              onClick={() => handleChange(language === 'Tiếng Việt' ? 'English' : 'Tiếng Việt')}
            >
              {language === 'Tiếng Việt' ? 'VN' : 'US'}
            </button>
          </div>
          <div className="cursor-pointer">
            <NotificationButton notifications={notification}/>
          </div>
          <Dropdown menu={{ items }} placement="bottom">
            <div className='p-2 rounded-2xl cursor-pointer'>
              <IoSettings />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }

  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const pageRef = useRef(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3300);
  }, []);

  useEffect(() => {
    if (!refresh_token) {
      console.log("Hãy đăng nhập để chúng tôi xác minh vai trò !");
      return;
    }

    const checkToken = async () => {
          const isValid = await Verify(refresh_token, access_token);
          if (isValid) {
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
          } else {
            messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('access_token');
          }
      };
    checkToken();
  }, [refresh_token, access_token]);

  // useEffect(() => {
  //     navigate(window.location); 
  // });

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
    if(refresh_token !== null && access_token !== null) {
      setInterval(() => {
        const checkToken = async () => {
          const isValid = await Verify(refresh_token, access_token);
            if (isValid) {
              console.log("Người dùng hợp lệ")
            } else {
              console.log(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
            }
        };
        checkToken()
      }, 30000)
    }
  }, [refresh_token, access_token])

  useEffect(() => {
    gsap.from(pageRef.current, {
      opacity: 0, // Bắt đầu với độ mờ 0 (hoàn toàn trong suốt)
      duration: 0.4,
      ease: 'power2.inOut',
    });
    gsap.to(pageRef.current, {
      opacity: 1, // Bắt đầu với độ mờ 0 (hoàn toàn trong suốt)
      duration: 0.4,
      ease: 'power2.inOut',
    });
  }, [location]);

  return (
    <>
      {loading ? (
      <Loadings />
    ) : user && user.role === 3 ? (
      <div className="flex relative flex-col">
        {contextHolder}
        {loadingCP && <Loading isLoading={isAdminView}/>}
        {user?.user_type == 0 && <AlertBanner refresh_token={refresh_token ?? ""} access_token={access_token ?? ""} isLoading={loadingCP} setLoading={setLoadingCP}/>}
        {isAdminView ? (
          <div className='flex'>
            <NavigationAdmin displayname={user.display_name} user={user}/>
            <div className="w-full flex flex-col" ref={pageRef}>
              <NavAdmin notification={notification} display_name={language() == "Tiếng Việt" ? "Bảng thống kê" : "Dash board"}/>
              <Routes>
                <Route path="/" element={<MainManage isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path="/Account" element={<Account aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path='/category' element={<CategoryManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path='/order' element={<OrderManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path='/product' element={<ProductManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path='/ship' element={<ShipManagement isLoading={loadingCP} aLert={{ addNotification: addNotification }} setLoading={setLoadingCP}/>} />
                <Route path='/discount' element={<DiscountCodeManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>} />
                <Route path='/profile' element={<ProfilePage isLoading={loadingCP} setLoading={setLoadingCP} addNotification={addNotification}/>} />
                <Route path='/errorpage' element={<NotFoundPage />}/>
                <Route path="/verify-account" element={<ResultVerifyAccount />} />
                <Route path="/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
                <Route path="*/verify-account" element={<ResultVerifyAccount />} />
                <Route path="*/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
              </Routes>
            </div>
          </div>
        ) : (
          <>
            <NavigationButtons notification={notification} toggleView={setIsAdminView} role={user?.role ?? null} cartItemCount={cartItemCount} userInfo={user ?? null} props={{ isLoading: loadingCP, setLoading: setLoadingCP }}/>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/signup" element={<Signup isLoading={loadingCP} setLoading={setLoadingCP}/>} />
              <Route path='/menu' element={<Menu addToCart={addToCart} cart={cart} />} />
              <Route path='/deal' element={<SealPage props={{ addNotification: addNotification }} addToCart={addToCart} cart={cart} setIsloading={setLoadingCP}/>} />
              <Route path='/contact' element={<ContactUs isLoading={loadingCP} setLoading={setLoadingCP}/>} />
              <Route path='/mycard' element={<MyCard cart={cart} setCart={setCart} user_infor={user} props={{ isLoading: loadingCP, setLoading: setLoadingCP }}/>} />
              <Route path='/payment' element={<OrderPageWithPayment setLoading={setLoadingCP} addNotification={addNotification}/>} />
              <Route path='/profile' element={<ProfilePage isLoading={loadingCP} setLoading={setLoadingCP} addNotification={addNotification}/>} />
              <Route path='/forgot-password' element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
              <Route path='/voucher' element={<VoucherPrivate aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
              <Route path='/errorpage' element={<NotFoundPage />}/>
              <Route path='/verify-account' element={<ResultVerifyAccount />}/>
              <Route path="/verify-account" element={<ResultVerifyAccount />} />
              <Route path="/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
              <Route path="*/verify-account" element={<ResultVerifyAccount />} />
              <Route path="*/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
            </Routes>
          </>
        )}
      </div>
    ) : user && (user.role == 1 || user.role == 2) ? 
    (
      <div className="flex relative flex-col" ref={pageRef}>
        {contextHolder}
        {loadingCP && <Loading isLoading={false}/>}
        {user?.user_type == 0 && <AlertBanner refresh_token={refresh_token ?? ""} access_token={access_token ?? ""} isLoading={loadingCP} setLoading={setLoadingCP}/>}
        <NavigationButtons notification={notification} toggleView={setIsAdminView} role={user?.role ?? null} cartItemCount={cartItemCount} userInfo={user ?? null} props={{ isLoading: loadingCP, setLoading: setLoadingCP }}/>
        <Routes>
          <Route path="/" element={user.role == 1 ? <OrderManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/> : <ShipManagement aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
          <Route path="/signup" element={<Signup isLoading={loadingCP} setLoading={setLoadingCP}/>} />
          <Route path='/forgot-password' element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
          <Route path='/profile' element={<ProfilePage isLoading={loadingCP} setLoading={setLoadingCP} addNotification={addNotification}/>} />
          <Route path='/verify-account' element={<ResultVerifyAccount />}/>
          <Route path='/errorpage' element={<NotFoundPage />}/>
          <Route path="/verify-account" element={<ResultVerifyAccount />} />
          <Route path="/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
          <Route path="*/verify-account" element={<ResultVerifyAccount />} />
          <Route path="*/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
        </Routes>
      </div>
    ) : (
      <div className="flex relative flex-col" ref={pageRef}>
        {contextHolder}
        {loadingCP && <Loading isLoading={false}/>}
        {user?.user_type == 0 && <AlertBanner refresh_token={refresh_token ?? ""} access_token={access_token ?? ""} isLoading={loadingCP} setLoading={setLoadingCP}/>}
        <NavigationButtons notification={notification} toggleView={setIsAdminView} role={user?.role ?? null} cartItemCount={cartItemCount} userInfo={user ?? null} props={{ isLoading: loadingCP, setLoading: setLoadingCP }}/>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup isLoading={loadingCP} setLoading={setLoadingCP}/>} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path='/menu' element={<Menu addToCart={addToCart} cart={cart} />} />
          <Route path='/deal' element={<SealPage props={{ addNotification: addNotification }} addToCart={addToCart} cart={cart} setIsloading={setLoadingCP}/>} />
          <Route path='/contact' element={<ContactUs isLoading={loadingCP} setLoading={setLoadingCP}/>} />
          <Route path='/voucher' element={<VoucherPrivate aLert={{ addNotification: addNotification }} isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
          <Route path='/forgot-password' element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP}/>}/>
          {refresh_token !== null && <>
            <Route path='/mycard' element={<MyCard cart={cart} setCart={setCart} user_infor={user} props={{ isLoading: loadingCP, setLoading: setLoadingCP }}/>} />
            <Route path='/payment' element={<OrderPageWithPayment setLoading={setLoadingCP} addNotification={addNotification}/>} />
            <Route path='/profile' element={<ProfilePage isLoading={loadingCP} setLoading={setLoadingCP} addNotification={addNotification}/>}/>
            <Route path='/verify-account' element={<ResultVerifyAccount />}/>
          </>}
          <Route path='/errorpage' element={<NotFoundPage />}/>
          <Route path="/verify-account" element={<ResultVerifyAccount />} />
          <Route path="/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
          <Route path="*/verify-account" element={<ResultVerifyAccount />} />
          <Route path="*/forgot-password" element={<ChangePassword isLoading={loadingCP} setLoading={setLoadingCP} />} />
        </Routes>
      </div>
    )}
    </>
  );
};

function NavigationAdmin({ displayname, user }: { displayname: string, user: UserInfo }): JSX.Element {
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [messageApi, contextHolder] = message.useMessage();
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
  const navigate = useNavigate();
  const checkTokenRouter = (router: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          navigate(router, { replace: true, state: user })
        } else {
          messageApi.error(language == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }
  const [navbar, setNavbar] = useState<MenuItem[]>([
    { id: 1, title: 'Trang chủ', english: 'Home', path: '/', icon: FaHome, active: true },
    { id: 2, title: 'Quản lý tài khoản', english: 'Account Management', path: 'Account', icon: RiUser3Line, active: false },
    { id: 3, title: 'Quản lý danh mục', english: 'Category Management', path: '/category', icon: RiHome5Line, active: false },
    { id: 4, title: 'Quản lý sản phẩm', english: 'Product Management', path: '/product', icon: RiShoppingBag3Line, active: false },
    { id: 5, title: 'Quản lý đơn đặt hàng', english: 'Order Management', path: '/order', icon: RiShoppingCart2Line, active: false },
    { id: 6, title: 'Quản lý giao hàng', english: 'Shipping Management', path: '/ship', icon: RiTruckLine, active: false },
    { id: 7, title: 'Quản lý mã giảm giá', english: 'Discount Management', path: '/discount', icon: RiPriceTag3Line, active: false },
  ]);
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage ? JSON.parse(savedLanguage) : "Tiếng Việt";
  });

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  const handleClick = (id: number) => {
    setNavbar((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, active: true } : { ...item, active: false }
      )
    );
  };

  useEffect(() => {
    setNavbar((prevItems) =>
      prevItems.map((item) =>
        item.path === window.location.pathname ? { ...item, active: true } : { ...item, active: false }
      )
    );
  }, []);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleNavigation = (path: string, id: number) => {
    navigate(path);
    handleClick(id);
    setIsMobileSidebarOpen(false); // Close sidebar after navigation on mobile
  };

  return (
    <>
      {contextHolder}
      <div className='lg:hidden fixed top-4 left-4 z-50'>
        <button 
          className='p-2 text-gray-700 cursor-pointer bg-white rounded-md shadow-md hover:bg-gray-100'
          onClick={toggleMobileSidebar}
        >
          <IoMenu size={24} className="text-slate-800" />
        </button>
      </div>

      {/* Sidebar - Shows from right on mobile */}
      <div className={`
        fixed lg:sticky top-0 right-0 lg:left-0 
        w-64 lg:w-1/5 h-screen bg-slate-800 text-white z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className='p-4 flex items-center space-x-3 border-b border-slate-700'>
          <div className='w-10 h-10 rounded-full bg-[#1890ff] flex items-center justify-center text-white font-bold'>A</div>
          <span className='text-lg font-bold'>ADMINISTRATOR</span>
        </div>
        
        <div className='mt-8 flex-1 overflow-y-auto'>
          {navbar.map((item) => {
            const isActive = item.active;
            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`flex items-center px-4 py-3 cursor-pointer ${isActive ? 'bg-slate-700 border-l-4 border-orange-500' : 'hover:bg-slate-700'}`}
              >
                <div className={`mr-3 ${isActive ? 'text-orange-500' : 'text-gray-300'}`}>
                  <item.icon size={20} />
                </div>
                <span className={isActive ? 'text-orange-500 font-medium' : 'text-gray-300'}>
                  {language === "Tiếng Việt" ? item.title : item.english}
                </span>
              </div>
            );
          })}
        </div>

        <div 
          className='cursor-pointer p-4 border-t border-slate-700' 
          onClick={() => {
            checkTokenRouter('/profile');
            setIsMobileSidebarOpen(false);
          }}
        >
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

      {/* Overlay for mobile - Only shows when sidebar is open */}
      {isMobileSidebarOpen && (
        <div 
          className='fixed inset-0 bg-black opacity-50 z-30 lg:hidden'
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
}

function NavigationButtons({ role, cartItemCount, userInfo, notification, toggleView, props }: { role: number|null; cartItemCount: number; userInfo: UserInfo|null; notification: string[]; toggleView: Dispatch<SetStateAction<boolean>>; props: Props }): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage ? JSON.parse(savedLanguage) : "Tiếng Việt";
  });

  const handleChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem('language', JSON.stringify(value));
    if (value === "Tiếng Việt") {
      localStorage.setItem('code_language', JSON.stringify("vi-VN"));
    } else {
      localStorage.setItem('code_language', JSON.stringify("en-US"));
    }
    window.location.reload();
  };

  const openDrawer = (): void => {
    setOpen(true);
  };

  const closeDrawer = (): void => {
    setOpen(false);
  };

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

  const checkTokenRouter = (router: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          navigate(router)
        } else {
          messageApi.error(language == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }

  const Logout = () => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          try {
            props.setLoading(true)
            const body = {
              language: null,
              refresh_token: refresh_token,
            };
            fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body),
            })
              .then((response) => response.json())
              .then((data) => {
                if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                  messageApi.error(data.message)
                  if (data.errors) {
                    for (const key in data.errors) {
                      if (data.errors[key] && data.errors[key].msg) {
                        messageApi.error(data.errors[key].msg);
                      }
                    }
                  }
                  return;
                }
                if (data.code === RESPONSE_CODE.USER_LOGOUT_SUCCESSFUL) {
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('access_token');
                  messageApi.open({
                    type: 'success',
                    content: 'Đăng xuất thành công',
                  }).then(() => {
                    localStorage.setItem('isAdminView', JSON.stringify(false))
                    window.location.reload()
                  }).then(() => { 
                    navigate('/')
                  })
                } else {
                  messageApi.error(data.message)
                  return
                }
              });
          } catch (error) {
            messageApi.error(String(error))
            return;
          } finally {
            setTimeout(() => {
              props.setLoading(false)
            }, 6000)
          }
        } else {
          messageApi.error(language == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken();
  };

  const items: MenuProps['items'] = ([
    {
      key: '1',
      label: (
        <button className='flex cursor-pointer gap-2 items-center' onClick={() => navigate("/profile", { replace: true, state: userInfo })}>
          <FaRegUserCircle /> Thông tin tài khoản
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button onClick={() => Logout()} className='flex cursor-pointer gap-2 items-center'>
          <IoLogOutOutline /> Đăng xuất
        </button>
      ),
    },
  ]);

  const itemAdmins: MenuProps['items'] = ([
    {
      key: '1',
      label: (
        <button className='flex cursor-pointer gap-2 items-center' onClick={() => navigate('/profile', { replace: true, state: userInfo })}>
          <FaRegUserCircle /> Thông tin tài khoản
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button className="flex cursor-pointer gap-2 items-center" onClick={() => {localStorage.setItem('isAdminView', JSON.stringify(true)); toggleView(true); checkTokenRouter('/')}}>
          <MdManageAccounts /> {language === "Tiếng Việt" ? "Quản lý" : "Manage"}
        </button>
      ),
    },
    {
      key: '3',
      label: (
        <button className='flex cursor-pointer gap-2 items-center' onClick={() => Logout()}>
          <IoLogOutOutline /> Đăng xuất
        </button>
      ),
    },
  ]);

  const style = {
    background: 'rgba(245, 245, 245, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    border: '1px solid rgba(245, 245, 245, 0.3)',
  };

  const getNavbar = () => {
    return refresh_token !== null ? Customer : NavbarUser
  }

  return (
    <>
    <div className='sticky top-0 z-50 navbarName' style={style}>
      {contextHolder}
      <div className="p-2 lg:text-xl flex flex-wrap items-center justify-between gap-4">
        {/* Logo Section */}
        <div className='flex items-center font-bold cursor-pointer min-w-[120px]'>
          <div onClick={() => navigate("/")} className='flex items-center text-black gap-2.5'>
            <img src="/images/system/logo tank food.png" className='w-10 md:w-16' alt="logo" />
            <p className='hidden sm:block'>Tank<span className='text-[#ffcc00]'>Food</span></p>
          </div>
        </div>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className='hidden lg:block flex-1 px-4 py-2'>
          <ul className='flex items-center justify-center gap-3 md:gap-5'>
            {(role === 0 || role === 3) && (
              Customer.map((item: NavbarItem) => (
                <li key={item.id} className="text-sm md:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#FF6B35] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
                  <button onClick={() => navigate(item.path)} className="links cursor-pointer font-semibold text-[#FF6B35] px-1 py-1 md:p-2 rounded-md transition duration-300">
                    {language === "Tiếng Việt" ? item.title : item.english}
                  </button>
                </li>
              ))
            )}
            {role === 1 && (
              NavbarEmployee.map((item: NavbarItem) => (
                <li key={item.id} className="text-sm md:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#FF6B35] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
                  <button onClick={() => navigate(item.path)} className="links cursor-pointer font-semibold text-[#FF6B35] px-1 py-1 md:p-2 rounded-md transition duration-300">
                    {language === "Tiếng Việt" ? item.title : item.english}
                  </button>
                </li>
              ))
            )}
            {role === 2 && (
              NavbarShipper.map((item: NavbarItem) => (
                <li key={item.id} className="text-sm md:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#FF6B35] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
                  <button onClick={() => navigate(item.path)} className="links cursor-pointer font-semibold text-[#FF6B35] px-1 py-1 md:p-2 rounded-md transition duration-300">
                    {language === "Tiếng Việt" ? item.title : item.english}
                  </button>
                </li>
              ))
            )}
            {role === null && (
              NavbarUser.map((item: NavbarItem) => (
                <li key={item.id} className="text-sm md:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#FF6B35] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
                  <button onClick={() => navigate(item.path)} className="links cursor-pointer font-semibold text-[#FF6B35] px-1 py-1 md:p-2 rounded-md transition duration-300">
                    {language === "Tiếng Việt" ? item.title : item.english}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Right Side Actions */}
        <div className='flex items-center gap-2 md:gap-4 lg:gap-6'>
          {/* Language Selector */}
          <div className='flex items-center gap-1 md:gap-2'>
            <button
              className={`p-1 md:p-2 cursor-pointer underline rounded-md bg-orange-500 text-white text-xs md:text-base`}
              onClick={() => handleChange(language === 'Tiếng Việt' ? 'English' : 'Tiếng Việt')}
            >
              {language === 'Tiếng Việt' ? 'VN' : 'US'}
            </button>
          </div>

          {refresh_token !== null ? (
            <div className='flex gap-2 md:gap-4 justify-center items-center'>
              {/* Cart Icon - Only for customers */}
              {(role === 0 || role === 3) && (
                <div className="text-orange-600 p-2 md:p-3 rounded-full shadow-lg cursor-pointer transition-colors relative" onClick={() => navigate("/mycard")}>
                  <RiShoppingCart2Line className="w-4 h-4 md:w-5 md:h-5"/>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              )}

              {/* Notification Bell */}
              <div className="cursor-pointer">
                <NotificationButton notifications={notification}/>
              </div>

              {/* User Dropdown */}
              <Dropdown menu={{ items: role === 3 ? itemAdmins : items}} arrow>
                <Button className='p-6 md:p-8'>
                  <FaUserAlt className="text-sm md:text-base" />
                </Button>
              </Dropdown>
            </div>
          ) : (
            <button
              className='flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-[#FF9A3D] hover:text-[#ffffff] transition duration-200 text-[#FF9A3D] rounded-full font-semibold border-2 border-[#FF9A3D] px-3 py-1 md:px-4 md:py-2 text-xs md:text-base'
              onClick={() => navigate("/signup")}
            >
              <IoIosLogIn className="text-sm md:text-base"/>{language === "Tiếng Việt" ? "Đăng nhập" : "Login"}
            </button>
          )}

          {/* Mobile Menu Button */}
          {(role === 0 || role === null || role === 3) && (
            <div className='lg:hidden px-2 py-1 md:px-3 md:py-2 bg-[#FF6B35] rounded-full text-[#ffffff]'>
              <button onClick={openDrawer}><IoMenu className="text-lg md:text-xl" /></button>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        {(role === 0 || role === null || role === 3) && (
          <Drawer 
            title={
              <div className='flex items-center gap-2'>
                <img src="/images/system/logo tank food.png" className='w-8' alt="logo" />
                <span>TankFood</span>
              </div>
            } 
            onClose={closeDrawer} 
            open={open}
            placement="left"
            width="75%"
          >
            <div className='w-full z-50'>
              <ul className='flex flex-col gap-4'>
                {getNavbar().map((item: NavbarItem) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => {
                        navigate(item.path);
                        closeDrawer();
                      }} 
                      className="w-full text-left p-3 font-semibold text-[#FF6B35] rounded-md transition duration-300 hover:bg-orange-50"
                    >
                      {language === "Tiếng Việt" ? item.title : item.english}
                    </button>
                    <Divider my="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </Drawer>
        )}
      </div>
    </div>
  </>
  );
}

function Main(): JSX.Element {
  const navigate = useNavigate()
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const Slideshow = (): JSX.Element => {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      AOS.init({
        duration: 1100,
        offset: 100,
        once: false,
        mirror: true,
      });
    }, []);

    const slides: Slide[] = [
      { src: "/images/system/1.png", alt: "Slide 1", effect: "fade-zoom" },
      { src: "/images/system/2.png", alt: "Slide 2", effect: "fade" },
      { src: "/images/system/3.png", alt: "Slide 3", effect: "slide" },
      { src: "/images/system/4.png", alt: "Slide 4", effect: "fade" },
    ];

    const showSlides = (): void => {
      let newIndex = slideIndex + 1;
      if (newIndex >= slides.length) {
        newIndex = 0;
      }
      setSlideIndex(newIndex);
    };

    const currentSlide = (index: number): void => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      setSlideIndex(index);
    };

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

    useEffect(() => {
      slideTimerRef.current = setTimeout(showSlides, 10000);

      return () => {
        if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      };
    }, [slideIndex, showSlides]);

    const getEffectClasses = (index: number, effect: string): string => {
      const baseClasses = 'absolute w-full h-full transition-all duration-1000 ease-in-out transform';
      const activeClasses = index === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0';

      let effectClasses = '';
      if (index === slideIndex) {
        switch (effect) {
          case 'zoom':
            effectClasses = 'scale-105';
            break;
          case 'fade-zoom':
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
          case 'fade-zoom':
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
        <div className="relative max-w-340 h-170 w-full mx-auto my-10 overflow-hidden rounded-lg shadow-2xl aspect-[16/9]">
          {slides.map((slide, index) => (
            <div key={index} className={getEffectClasses(index, slide.effect)}>
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

          <button
            className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-20 focus:outline-none"
            onClick={() => changeSlide(-1)}
          >
            ❮
          </button>

          <button
            className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-20 focus:outline-none"
            onClick={() => changeSlide(1)}
          >
            ❯
          </button>
        </div>

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
      <style>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <Slideshow />
      <div className="bg-gradient-to-b from-[#FFE5B4] to-[#92e2fb] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiNGRkI4MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>

                <div className="flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up" data-aos-duration="1000">
                    <div className="relative w-full md:w-1/3 flex justify-center" data-aos="zoom-in" data-aos-delay="300">
                        <div className="relative transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
                            <div className="w-72 h-72 rounded-full border-4 border-[#FFB800] p-2 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-[#FF7846]">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FF7846]/30 transition-all duration-300 hover:border-[#FFB800]">
                                    <img
                                        src="/images/system/Hamburger_trangchu.jpg"
                                        alt={language() == "Tiếng Việt" ? "Burger đặc biệt" : "Special Burger"}
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
                            <span className="text-[#654321]">{language() == "Tiếng Việt" ? "Nâng " : "Elevate "}</span>
                            <span className="text-[#FF7846]">{language() == "Tiếng Việt" ? "cao " : "your "}</span>
                            <span className="text-[#654321]">{language() == "Tiếng Việt" ? "bữa ăn" : "meal"}</span>
                        </h2>
                        <p className="text-[#654321] mb-6 max-w-xl font-roboto">
                            {language() == "Tiếng Việt"
                                ? "Bạn sẽ tìm thấy nhiều thông tin về cách nâng cao trải nghiệm ẩm thực của bạn. Có rất nhiều cách để chế biến một bữa ăn tuyệt vời tại TankFood. Tất cả những gì bạn cần là nguyên liệu phù hợp, vai trò nấu nướng và một chút sáng tạo."
                                : "You'll find lots of info on how to make your food experience even better. There are so many ways to cook a great meal at TankFood. All you need are the right ingredients, some cooking skills, and a little imagination."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button onClick={() => navigate('/menu')} className="bg-[#FF7846] cursor-pointer hover:bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-roboto shadow-md hover:shadow-lg hover:translate-y-[-3px] hover:px-8">
                                {language() == "Tiếng Việt" ? "Đặt hàng ngay" : "Order Now"}
                            </button>
                            <button onClick={() => navigate('/menu')} className="border-2 cursor-pointer border-[#654321] text-[#654321] hover:bg-[#654321] hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-roboto shadow-md hover:shadow-lg hover:translate-y-[-3px]">
                                {language() == "Tiếng Việt" ? "Xem thực đơn" : "View Menu"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-16 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up">
                    <h2 className="text-3xl font-bold text-center mb-8 font-roboto" data-aos="zoom-in">
                        <span className="text-[#654321]">{language() == "Tiếng Việt" ? "Danh mục " : "Featured "}</span>
                        <span className="text-[#FF7846]">{language() == "Tiếng Việt" ? "nổi bật" : "Categories"}</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="100">
                            <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                                <img
                                    src="/images/system/Hamburger_trangchu2.jpg"
                                    alt={language() == "Tiếng Việt" ? "Bánh mì kẹp thịt" : "Burger"}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">{language() == "Tiếng Việt" ? "Bánh mì kẹp thịt" : "Burger"}</h3>
                            <p className="text-sm text-gray-500 text-center font-roboto">{language() == "Tiếng Việt" ? "Đa dạng hương vị" : "Variety of flavors"}</p>
                        </div>

                        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="200">
                            <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                                <img
                                    src="/images/system/Khoaitaychien_trangchu.jpg"
                                    alt={language() == "Tiếng Việt" ? "Khoai tây chiên" : "French Fries"}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">{language() == "Tiếng Việt" ? "Khoai tây chiên" : "French Fries"}</h3>
                            <p className="text-sm text-gray-500 text-center font-roboto">{language() == "Tiếng Việt" ? "Giòn tan hấp dẫn" : "Crispy and delicious"}</p>
                        </div>

                        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="300">
    <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
        <img
            src="/images/system/garan_trangchu.jpg"
            alt={language() == "Tiếng Việt" ? "Gà rán" : "Fried Chicken"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
    </div>
      <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">{language() == "Tiếng Việt" ? "Gà rán" : "Fried Chicken"}</h3>
      <p className="text-sm text-gray-500 text-center font-roboto">{language() == "Tiếng Việt" ? "Thơm ngon đặc biệt" : "Especially delicious"}</p>
    </div>

    <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="flip-left" data-aos-delay="400">
        <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
            <img
                src="/images/system/nuocuong_trangchu.jpg"
                alt={language() == "Tiếng Việt" ? "Thức uống" : "Drinks"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
        </div>
        <h3 className="text-lg font-semibold text-[#654321] text-center font-roboto">{language() == "Tiếng Việt" ? "Thức uống" : "Drinks"}</h3>
        <p className="text-sm text-gray-500 text-center font-roboto">{language() == "Tiếng Việt" ? "Giải khát sảng khoái" : "Refreshing"}</p>
    </div>
    </div>

    <div className="py-16 px-4 md:px-8 lg:px-16 relative z-10" data-aos="fade-up">
        <div className="text-center mb-8">
            <h3 className="text-3xl font-medium text-[#654321] font-roboto" data-aos="fade-up">{language() == "Tiếng Việt" ? "MÓN ĂN NGON" : "DELICIOUS FOOD"}</h3>
            <h2 className="text-5xl font-bold text-[#FF7846] mt-2 font-roboto" data-aos="zoom-in" data-aos-delay="200">{language() == "Tiếng Việt" ? "GIÁ TUYỆT VỜI" : "AMAZING PRICES"}</h2>
            <p className="text-[#654321] max-w-2xl mx-auto mt-4 font-roboto" data-aos="fade-up" data-aos-delay="400">
                {language() == "Tiếng Việt"
                    ? "Khám phá các món ăn tuyệt vời của chúng tôi, được tạo ra để giúp bạn tìm đúng công thức cho bữa ăn hoàn hảo tại TankFood."
                    : "Discover our amazing dishes, created to help you find the perfect meal recipe at TankFood."}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-right" data-aos-delay="100">
                <div className="h-56 overflow-hidden">
                    <img
                        src="/images/system/burgerdacbiet.jpg"
                        alt={language() == "Tiếng Việt" ? "Burger Đặc Biệt" : "Special Burger"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#654321] font-roboto">{language() == "Tiếng Việt" ? "Burger Đặc Biệt" : "Special Burger"}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[#FF7846] font-bold font-roboto">89.000 ₫</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-up" data-aos-delay="200">
                <div className="h-56 overflow-hidden">
                    <img
                        src="/images/system/khoaiphomai.jpg"
                        alt={language() == "Tiếng Việt" ? "Khoai Phô Mai" : "Cheese Fries"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#654321] font-roboto">{language() == "Tiếng Việt" ? "Khoai Phô Mai" : "Cheese Fries"}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[#FF7846] font-bold font-roboto">49.000 ₫</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-[#FFB800]/20 hover:shadow-xl hover:translate-y-[-5px] hover:border-[#FF7846]" data-aos="fade-left" data-aos-delay="300">
                <div className="h-56 overflow-hidden">
                    <img
                        src="/images/system/garansotthai.jpg"
                        alt={language() == "Tiếng Việt" ? "Gà Rán Giòn" : "Crispy Fried Chicken"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#654321] font-roboto">{language() == "Tiếng Việt" ? "Gà Rán Giòn" : "Crispy Fried Chicken"}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[#FF7846] font-bold font-roboto">79.000 ₫</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#9ee8ff] to-[#FFE5B4] text-center relative z-10 shadow-inner" data-aos="fade-up">
        <div className="absolute top-8 left-1/4 text-[#FFB800] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
            </svg>
        </div>

        <h3 className="text-4xl font-bold text-[#654321] mb-2 font-stretch-semi-condensed blur-text" data-aos="fade-up" data-aos-delay="200">{language() == "Tiếng Việt" ? "Vẫn còn đói?" : "Still hungry?"}</h3>
        <h2 className="text-6xl font-bold text-[#FF7846] mb-12 font-roboto blur-text" data-aos="zoom-in" data-aos-delay="400">{language() == "Tiếng Việt" ? "ĐẶT THÊM NGAY" : "ORDER MORE NOW"}</h2>

        <button onClick={() => navigate('/menu')} className="bg-[#FF7846] hover:bg-[#FF6B35] cursor-pointer text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg font-roboto shadow-lg hover:shadow-xl hover:translate-y-[-5px] hover:px-10" data-aos="fade-up" data-aos-delay="600">
            {language() == "Tiếng Việt" ? "Đặt hàng ngay" : "Order now"}
        </button>

        <div className="absolute bottom-8 right-1/4 text-[#FFB800] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
            </svg>
        </div>
    </div>
    <div className="relative bg-gradient-to-r from-orange-500 to-red-500 py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 2 + 1}rem`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: 0.3,
                        }}
                    >
                        🍔
                    </div>
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i + 20}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 2 + 1}rem`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: 0.3,
                        }}
                    >
                        🍟
                    </div>
                ))}
            </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <div
                className="max-w-3xl mx-auto text-center"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay="100"
                data-aos-anchor-placement="top-bottom"
            >
                <div className="mb-8 transform transition-transform duration-700 hover:scale-105">
                    <h2
                        className="text-6xl font-bold mb-2 text-white drop-shadow-lg"
                        style={{
                            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        TankFood
                    </h2>
                    <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
                </div>

                <p className="text-xl text-white/90 mb-8 drop-shadow-md">
                    {language() == "Tiếng Việt"
                        ? "Thưởng thức những món ăn ngon nhất với dịch vụ giao hàng nhanh chóng và tiện lợi!"
                        : "Enjoy the most delicious dishes with fast and convenient delivery service!"}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="300">
                    <input
                        type="email"
                        placeholder={language() == "Tiếng Việt" ? "Địa Chỉ Email Của Bạn" : "Your Email Address"}
                        className="flex-grow px-4 py-3 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                    />
                    <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-yellow-50 px-6 py-3 rounded-md font-bold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                        {language() == "Tiếng Việt" ? "Đặt Hàng Ngay" : "Order Now"}
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-6" data-aos="fade-up" data-aos-delay="500">
                    {[language() == "Tiếng Việt" ? "Burger" : "Burger",
                    language() == "Tiếng Việt" ? "Gà Rán" : "Fried Chicken",
                    language() == "Tiếng Việt" ? "Pizza" : "Pizza",
                    language() == "Tiếng Việt" ? "Đồ Uống" : "Drinks"
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium shadow-md hover:bg-white/30 cursor-pointer transition-all"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

        {/* Animated elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="relative h-16">
            <div
              className="absolute bottom-0 left-0 w-[200%] h-16"
              style={{
                background:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                backgroundSize: "100% 100%",
                animation: "wave 15s linear infinite",
              }}
            ></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <footer className="py-8 bg-orange-800 text-white">
                <div className="container mx-auto px-4 text-center">
                <p className="font-['Roboto_Slab']">© 2025 TankFood. Đã đăng ký bản quyền.</p>
                </div>
            </footer>
      </div>
    </>
  );
}

export default FormMain;