import React, { FormEvent, useState, useEffect } from "react"
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
import { motion } from "framer-motion";
import TurnstileCaptcha from "../components/Capcha.components";

// interface đăng ký

interface Signup {
    display_name: string,
    phone: string,
    email: string,
    password: string,
    confirm_pass: string
}

// interface đăng nhập

interface Login {
    email: string,
    password: string,
}

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<Props> = (props) => {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [formType, setFormType] = useState('login');
    const [people, setPeople] = useState<string>("")
    const [formData, setFormData] = useState<Signup>({
        display_name: "",
        phone: "",
        email: "",
        password: "",
        confirm_pass: ""
    });

    const [loginData, setLoginData] = useState<Login>({
        email: "",
        password: "",
    })

    // lỗi của đăng ký 
    const [errors, setErrors] = useState<Partial<Signup>>({});

    // lỗi của đăng nhập
    const [errorLogin, setErrorsLogin] = useState<Partial<Login>>({});

    // kiểm tra email nhập liệu
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    // kiểm tra số điện thoại nhập liệu
    const validatePhoneNumber = (phone: string): boolean => {
      const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
      return phoneRegex.test(phone);
    };
    

    // kiểm tra dữ liệu đầu vào đăng ký
    const validateForm = (): boolean => {
        const newErrors: Partial<Signup> = {};
    
        if (!formData.display_name.trim()) {
          newErrors.display_name = "Tên hiển thị không được để trống";
        }
        if (!formData.phone.match(/^\d{10}$/) || !validatePhoneNumber(formData.phone)) {
          newErrors.phone = "Số điện thoại phải có 10 chữ số và đúng định dạng";
        }
        if (!formData.email.includes("@") || !validateEmail(formData.email)) {
          newErrors.email = "Email không hợp lệ";
        }
        if (formData.password.length < 6) {
          newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        if (formData.password !== formData.confirm_pass) {
          newErrors.confirm_pass = "Mật khẩu không khớp";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // kiểm tra dữ liệu đầu vào đăng nhập
    const valiteLoginform = (): boolean => {
      const newErrors: Partial<Login> = {};

      if(!loginData.email.trim()) {
        newErrors.email = 'Tên user đăng nhập không được để trống'
      }
      if(!validateEmail(loginData.email)) {
        newErrors.email = 'Vui lòng nhập đúng gmail user'
      }
      if(!loginData.password.trim()) {
        newErrors.password = 'Mật khẩu không được để trống'
      }

      setErrorsLogin(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleLoginChange = (e: FormEvent<HTMLInputElement>) => {
        const { id, value } = e.currentTarget; // Sử dụng e.currentTarget thay vì e.target
      
        setLoginData({ 
          ...loginData, 
          [id.replace('login-', '')]: value 
        });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
      setShowNewPassword(!showNewPassword);
    };
  
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
    
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
      const { id, value } = e.currentTarget;
      const fieldName = id.replace('register-', ''); // Loại bỏ 'register-' để lấy đúng tên thuộc tính
      setFormData({
          ...formData,
          [fieldName]: value
        });
    };

    const ForgotPass = (email: string|null) => {
      if(email == null || email == "") {
        messageApi.error("Vui lòng nhập email !")
        return
      }
      if(!validateEmail(email))
      {
        messageApi.error("Vui lòng ghi đúng định dạng email !")
      }

      try {
        props.setLoading(true)
        const body = {
          language: null,
          email: email
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/users/send-email-forgot-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(response => {
          return response.json()
        }).then((data) => {
          if(data.code == RESPONSE_CODE.AUTHENTICATION_FAILED || data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
            messageApi.error(data.errors.email.msg)
            return
          }
          messageApi.success("Gửi email yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra hòm thư của bạn !")
          console.log(data)
        })
      } catch (error) {
        messageApi.error(String(error))
      } finally {
        setTimeout(() => {
          props.setLoading(false)
        }, 2000)
      }

    }

    // Nút đăng ký
    const handleSubmit = (e: React.FormEvent) => {
      if (!captchaToken) {
        messageApi.error('Vui lòng hoàn thành CAPTCHA');
        return;
      }
      try {
        props.setLoading(true)
        e.preventDefault();
        if (validateForm()) {
            const bodyResignter = {
              language: null,
              display_name: formData.display_name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              confirm_password: formData.confirm_pass,
              'cf-turnstile-response': captchaToken
            }

            fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(bodyResignter)
            }).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.USER_REGISTRATION_FAILED) {
                messageApi.open({
                  type: 'error',
                  content: data.message,
                  style: {
                    marginTop: '10vh',
                  },
                })
                return
              }
              if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                messageApi.open({
                  type: 'error',
                  content: `${data.errors.email ? data.errors.email.msg: ""}, ${data.errors.phone ? data.errors.phone.msg : ""}`,
                  style: {
                    marginTop: '10vh',
                  },
                })
                return 
              }
              if(data.code == RESPONSE_CODE.USER_REGISTRATION_SUCCESSFUL) {
                messageApi.open({
                  type: 'success',
                  content: 'Đăng ký thành công',
                  style: {
                    marginTop: '10vh',
                  },
                })
                const body = {
                  language: null,
                  email: formData.email.trim(),
                  password: formData.password.trim(),
                  'cf-turnstile-response': captchaToken
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/users/login` , {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                }).then((response) => {
                  return response.json()
                }).then((data) => {
                  if(data.code == RESPONSE_CODE.AUTHENTICATION_FAILED) {
                    messageApi.open({
                      type: 'error',
                      content: data.message,
                      style: {
                        marginTop: '10vh',
                      },
                    })
                  }
                  if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                    messageApi.open({
                      type: 'error',
                      content: data.errors.email.msg,
                      style: {
                        marginTop: '10vh',
                      },
                    })
                  }
                  if(data.code == RESPONSE_CODE.USER_LOGIN_SUCCESSFUL) {
                    localStorage.setItem('access_token', data.authenticate.access_token)
                    localStorage.setItem('refresh_token', data.authenticate.refresh_token)
                    messageApi.open({
                      type: 'success',
                      content: 'Đăng nhập thành công',
                      style: {
                        marginTop: '10vh',
                      },
                    }).then(() => {
                      setTimeout(() => {
                        navigate("/");
                        window.location.reload();
                      }, 1000);
                    });
                  }
                })
              }
            })
        } else {
            messageApi.open({
              type: 'error',
              content: `Đăng ký thất bại vui lòng thử lại sau !`,
              style: {
                marginTop: '10vh',
              },
            });
        }
      } catch (error) {
        messageApi.error(String(error))
      } finally {
        setTimeout(() => {
          props.setLoading(false)
        }, 2000)
      }
    };

    // Nút đăng nhập
    const handleLoginSubmit = (e: FormEvent) => {
      if (!captchaToken) {
        messageApi.error('Vui lòng hoàn thành CAPTCHA');
        return;
      }
      try {
        props.setLoading(true)
        e.preventDefault();
        if(valiteLoginform()) {
          const body = {
            language: null,
            email: loginData.email.trim(),
            password: loginData.password.trim(),
            'cf-turnstile-response': captchaToken
          }
          fetch(`${import.meta.env.VITE_API_URL}/api/users/login` , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then((response) => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.AUTHENTICATION_FAILED) {
              messageApi.open({
                type: 'error',
                content: data.message,
                style: {
                  marginTop: '10vh',
                },
              })
            }
            if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
              messageApi.open({
                type: 'error',
                content: data.errors.email.msg,
                style: {
                  marginTop: '10vh',
                },
              })
            }
            if(data.code == RESPONSE_CODE.USER_LOGIN_SUCCESSFUL) {
              localStorage.setItem('access_token', data.authenticate.access_token)
              localStorage.setItem('refresh_token', data.authenticate.refresh_token)
              messageApi.open({
                type: 'success',
                content: 'Đăng nhập thành công',
                style: {
                  marginTop: '10vh',
                },
              }).then(() => {
                setTimeout(() => {
                  navigate("/");
                  window.location.reload();
                }, 1000);
              });
            }
          })
        } else {
          messageApi.open({
            type: 'error',
            content: `Đăng nhập thất bại vui lòng thử lại sau`,
            style: {
              marginTop: '10vh',
            },
          });
        }
      } catch (error) {
        messageApi.error(String(error))
      } finally {
        setTimeout(() => {
          props.setLoading(false)
        }, 2000)
      }
    };


    const showForm = (type: string) => {
      setFormType(type);
    };

    useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/statistical/analytics-total-requests`, {
        method: 'GET'
      }).then(response => {
        return response.json()
      }).then((data) => {
        if(data.code == RESPONSE_CODE.ANALYTICS_TOTAL_REQUESTS_SUCCESSFUL) {
          setPeople(data.total)
        }
      })
    }, [])

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: 'url("/api/placeholder/1200/800")', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        {contextHolder}
          <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
            {/* Info Side */}
            <div className="w-full md:w-2/5 bg-orange-500 text-white p-6 md:p-8 flex flex-col justify-between">
              <div>
                  <div className="text-2xl font-bold mb-6">Tank<span className="text-yellow-300">Food</span></div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">Thưởng thức ẩm thực nhanh chóng!</h1>
                  <p className="mb-6 leading-relaxed">Đăng nhập để đặt món ăn yêu thích và nhận nhiều ưu đãi hấp dẫn.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">✓</div>
                        <div>Giao hàng nhanh chóng</div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">✓</div>
                        <div>Ưu đãi độc quyền cho thành viên</div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">✓</div>
                        <div>Đa dạng món ăn</div>
                    </div>
                  </div>
              </div>
              
              <div className="mt-6">
                  <p>Đã có hơn {people} khách hàng truy cập</p>
              </div>
            </div>
            
            {/* Form Side */}
            <div className="w-full md:w-3/5 p-6 md:p-8">
              <div className="flex border-b mb-8">
                  <button 
                    className={`pb-2 cursor-pointer px-4 font-semibold ${formType === 'login' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
                    onClick={() => showForm('login')}
                  >
                    Đăng nhập
                  </button>
                  <button 
                    className={`pb-2 cursor-pointer px-4 font-semibold ${formType === 'register' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
                    onClick={() => showForm('register')}
                  >
                    Đăng ký
                  </button>
              </div>
              
              {formType === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            id="login-email" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="Nhập địa chỉ email của bạn" 
                            value={loginData.email}
                            onChange={handleLoginChange} 
                          />
                          {errorLogin.email && <p className="text-red-500 text-sm mt-1">{errorLogin.email}</p>}
                      </div>
                      
                      <div>
                          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              id="login-password" 
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-10"
                              placeholder="Nhập mật khẩu của bạn" 
                              value={loginData.password}
                              onChange={handleLoginChange}
                            />
                            <motion.button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                              whileTap={{ scale: 0.95 }}
                            >
                              {showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.177 8-5.042 8-3.868 0-7.659-3.943-8.933-8z" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </motion.button>
                          </div>
                          {errorLogin.password && <p className="text-red-500 text-sm mt-1">{errorLogin.password}</p>}
                      </div>
                      
                      <div className="flex justify-between gap-5">
                          <TurnstileCaptcha
                            siteKey="0x4AAAAAABJKaIKjco1vWIzB" // Thay bằng site key của bạn
                            onVerify={(token) => setCaptchaToken(token)}
                          />
                          <button type="button" onClick={() => ForgotPass(loginData.email)} className="text-sm text-orange-500 hover:underline cursor-pointer focus:outline-none">
                            Quên mật khẩu?
                          </button>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full cursor-pointer bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Đăng nhập
                      </button>
                  </form>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label htmlFor="register-display_name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                          <input 
                            type="text" 
                            id="register-display_name" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="Nhập họ tên đầy đủ" 
                            value={formData.display_name}
                            onChange={handleChange}
                          />
                          {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>}
                      </div>
                      
                      <div>
                          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            id="register-email" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="Nhập địa chỉ email của bạn" 
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                          <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                          <input 
                            type="tel" 
                            id="register-phone" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="Nhập số điện thoại của bạn" 
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      
                      <div>
                          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                          <div className="relative">
                            <input 
                              type={showNewPassword ? "text" : "password"} 
                              id="register-password" 
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-10"
                              placeholder="Tạo mật khẩu" 
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <motion.button
                              type="button"
                              onClick={toggleNewPasswordVisibility}
                              className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                              whileTap={{ scale: 0.95 }}
                            >
                              {showNewPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.177 8-5.042 8-3.868 0-7.659-3.943-8.933-8z" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </motion.button>
                          </div>
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>
                      
                      <div>
                          <label htmlFor="register-confirm_pass" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                          <div className="relative">
                            <input 
                              type={showConfirmPassword ? "text" : "password"} 
                              id="register-confirm_pass" 
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-10"
                              placeholder="Nhập lại mật khẩu" 
                              value={formData.confirm_pass}
                              onChange={handleChange}
                            />
                            <motion.button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                              className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                              whileTap={{ scale: 0.95 }}
                            >
                              {showConfirmPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.177 8-5.042 8-3.868 0-7.659-3.943-8.933-8z" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </motion.button>
                          </div>
                          {errors.confirm_pass && <p className="text-red-500 text-sm mt-1">{errors.confirm_pass}</p>}
                      </div>

                      <TurnstileCaptcha
                        siteKey="0x4AAAAAABJKaIKjco1vWIzB" // Thay bằng site key của bạn
                        onVerify={(token) => setCaptchaToken(token)}
                      />
                      
                      <button 
                        type="submit" 
                        className="w-full cursor-pointer bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Đăng ký
                      </button>
                  </form>
              )}
            </div>
          </div>
      </div>
    )
}

export default Signup