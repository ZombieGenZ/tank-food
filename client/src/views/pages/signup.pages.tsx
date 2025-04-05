import React, { FormEvent, useState } from "react"
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { RESPONSE_CODE } from "../../constants/responseCode.constants";

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
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [formType, setFormType] = useState('login');
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

    // 
    
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
          messageApi.success("Gửi email xác thực thành công. Vui lòng kiểm tra hòm thư của bạn !")
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
              confirm_password: formData.confirm_pass
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
              }
              if(data.code == RESPONSE_CODE.USER_REGISTRATION_SUCCESSFUL) {
                messageApi.open({
                  type: 'success',
                  content: 'Đăng ký thành công, Vui lòng đăng nhập lại với tài khoản mới !',
                  style: {
                    marginTop: '10vh',
                  },
                }).then(() => {
                  setTimeout(() => {
                    navigate("/");
                  }, 1500);
                });
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
      try {
        props.setLoading(true)
        e.preventDefault();
        if(valiteLoginform()) {
          const body = {
            language: null,
            email: loginData.email.trim(),
            password: loginData.password.trim()
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
            console.log(data)
            if(data.message == "Đăng nhập tài khoản thành công") {
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
            else {
              messageApi.open({
                type: 'error',
                content: 'Đăng nhập thất bại | Vui lòng kiểm tra lại thông tin',
                style: {
                  marginTop: '10vh',
                },
              })
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

    return (
        <div style={styles.body}>
          {contextHolder}
            <div style={styles.container}>
              <div style={styles.infoSide}>
                
                <div>
                    <div style={styles.logo}>Tank<span style={{ color: '#ffcc00' }}>Food</span></div>
                    <h1 style={styles.infoTitle}>Thưởng thức ẩm thực nhanh chóng!</h1>
                    <p style={styles.infoText}>Đăng nhập để đặt món ăn yêu thích và nhận nhiều ưu đãi hấp dẫn.</p>
                    
                    <div style={styles.features}>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>✓</div>
                        <div>Giao hàng nhanh chóng</div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>✓</div>
                        <div>Ưu đãi độc quyền cho thành viên</div>
                    </div>
                    <div style={styles.feature}>
                        <div style={styles.featureIcon}>✓</div>
                        <div>Đa dạng món ăn</div>
                    </div>
                    </div>
                </div>
                
                <div>
                    <p>Đã có hơn 10,000+ khách hàng hài lòng</p>
                </div>
                </div>
                
                <div style={styles.formSide}>
                <div style={styles.tabs}>
                    <div 
                    style={formType === 'login' ? {...styles.tab, ...styles.activeTab} : styles.tab} 
                    onClick={() => showForm('login')}
                    >
                    Đăng nhập
                    </div>
                    <div 
                    style={formType === 'register' ? {...styles.tab, ...styles.activeTab} : styles.tab} 
                    onClick={() => showForm('register')}
                    >
                    Đăng ký
                    </div>
                </div>
                
                {formType === 'login' ? (
                    <form onSubmit={handleLoginSubmit} style={{ display: 'block' }}>
                        <div style={styles.formGroup}>
                            <label htmlFor="login-email" style={styles.label}>Email</label>
                            <input 
                            type="email" 
                            id="login-email" 
                            style={styles.input}
                            placeholder="Nhập địa chỉ email của bạn" 
                            value={loginData.email}
                            onChange={handleLoginChange} 
                            />
                            {errorLogin.email && <p className="text-red-500 mt-2.5">{errorLogin.email}</p>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="login-password" style={styles.label}>Mật khẩu</label>
                            <input 
                            type="password" 
                            id="login-password" 
                            style={styles.input}
                            placeholder="Nhập mật khẩu của bạn" 
                            value={loginData.password}
                            onChange={handleLoginChange}
                            />
                            {errorLogin.password && <p className="text-red-500 mt-2.5">{errorLogin.password}</p>}
                        </div>
                        
                        <div style={styles.forgotPassword}>
                            <a href="#" onClick={() => ForgotPass(loginData.email)} style={styles.forgotPasswordLink}>Quên mật khẩu?</a>
                        </div>
                        
                        <button type="submit" style={styles.btn}>Đăng nhập</button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'block' }}>
                        <div style={styles.formGroup}>
                            <label htmlFor="register-display_name" style={styles.label}>Họ và tên</label>
                            <input 
                            type="text" 
                            id="register-display_name" 
                            style={styles.input}
                            placeholder="Nhập họ tên đầy đủ" 
                            value={formData.display_name}
                            onChange={handleChange}
                            />
                            {errors.display_name && <p className="text-red-500 mt-2.5">{errors.display_name}</p>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="register-email" style={styles.label}>Email</label>
                            <input 
                            type="email" 
                            id="register-email" 
                            style={styles.input}
                            placeholder="Nhập địa chỉ email của bạn" 
                            value={formData.email}
                            onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 mt-2.5">{errors.email}</p>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="register-phone" style={styles.label}>Số điện thoại</label>
                            <input 
                            type="tel" 
                            id="register-phone" 
                            style={styles.input}
                            placeholder="Nhập số điện thoại của bạn" 
                            value={formData.phone}
                            onChange={handleChange}
                            />
                            {errors.phone && <p className="text-red-500 mt-2.5">{errors.phone}</p>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="register-password" style={styles.label}>Mật khẩu</label>
                            <input 
                            type="password" 
                            id="register-password" 
                            style={styles.input}
                            placeholder="Tạo mật khẩu" 
                            value={formData.password}
                            onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500 mt-2.5">{errors.password}</p>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="register-confirm_password" style={styles.label}>Xác nhận mật khẩu</label>
                            <input 
                            type="password" 
                            id="register-confirm_pass" 
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu" 
                            value={formData.confirm_pass}
                            onChange={handleChange}
                            />
                            {errors.confirm_pass && <p className="text-red-500 mt-2.5">{errors.confirm_pass}</p>}
                        </div>
                        
                        <button type="submit" style={styles.btn}>Đăng ký</button>
                    </form>
                )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    body: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("/api/placeholder/1200/800")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    container: {
      width: '900px',
      display: 'flex',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
    },
    infoSide: {
      width: '40%',
      backgroundColor: '#FF6B35',
      padding: '40px 25px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    infoTitle: {
      fontSize: '28px',
      marginBottom: '20px',
    },
    infoText: {
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    features: {
      marginTop: '30px',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    featureIcon: {
      width: '30px',
      height: '30px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      marginRight: '15px',
    },
    formSide: {
      width: '60%',
      padding: '40px',
    },
    tabs: {
      display: 'flex',
      marginBottom: '30px',
    },
    tab: {
      padding: '10px 15px',
      cursor: 'pointer',
      fontWeight: 600,
      color: '#777',
      borderBottom: '2px solid transparent',
      marginRight: '20px',
    },
    activeTab: {
      color: '#FF6B35',
      borderBottom: '2px solid #FF6B35',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500,
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '15px',
      transition: 'border 0.3s',
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: '20px',
    } as React.CSSProperties,
    forgotPasswordLink: {
      color: '#FF6B35',
      textDecoration: 'none',
      fontSize: '14px',
    },
    btn: {
      backgroundColor: '#FF6B35',
      color: 'white',
      padding: '12px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 600,
      width: '100%',
      transition: 'background-color 0.3s',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
    },
  };

export default Signup