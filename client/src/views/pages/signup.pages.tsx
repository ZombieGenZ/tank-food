import React, { FormEvent, useState } from "react"
import { Modal } from 'antd';

interface Signup {
    display_name: string,
    phone: string,
    email: string,
    password: string,
    confirm_pass: string
}

interface Login {
    email: string,
    password: string,
}

const Signup: React.FC = () => {
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

    const [errors, setErrors] = useState<Partial<Signup>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Signup> = {};
    
        if (!formData.display_name.trim()) {
          newErrors.display_name = "Tên hiển thị không được để trống";
        }
        if (!formData.phone.match(/^\d{10}$/)) {
          newErrors.phone = "Số điện thoại phải có 10 chữ số";
        }
        if (!formData.email.includes("@")) {
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

    const handleLoginChange = (e: FormEvent<HTMLInputElement>) => {
        const { id, value } = e.currentTarget; // Sử dụng e.currentTarget thay vì e.target
      
        setLoginData({ 
          ...loginData, 
          [id.replace('login-', '')]: value 
        });
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
        ...formData,
        [name]: value,
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Dữ liệu đăng ký:", formData);
            Modal.success({
              content: 'Đăng nhập thành công',
            });
        } else {
            console.log(errors)
            Modal.error({
              title: 'This is an error message',
              content: `${errors}`,
            });
        }
    };

    const handleLoginSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Login Data:', loginData);
        Modal.success({
          content: 'Đăng nhập thành công',
        });
      };

    const showForm = (type: string) => {
        setFormType(type);
      };

    return (
        <div style={styles.body}>
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
                            required 
                            />
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
                            required 
                            />
                        </div>
                        
                        <div style={styles.forgotPassword}>
                            <a href="#" style={styles.forgotPasswordLink}>Quên mật khẩu?</a>
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
                            required 
                            />
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
                            required 
                            />
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
                            required 
                            />
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
                            required 
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="register-confirm_password" style={styles.label}>Xác nhận mật khẩu</label>
                            <input 
                            type="password" 
                            id="register-confirm_password" 
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu" 
                            value={formData.confirm_pass}
                            onChange={handleChange}
                            required 
                            />
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
      backgroundColor: '#f9f9f9',
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