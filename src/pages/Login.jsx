import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { GoogleOutlined } from "@ant-design/icons"
import { motion } from 'framer-motion';


const { Title } = Typography;

const Login = () => {
    const { login, passwordReset, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [theMail, setTheMail] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)

    const onFinish = async (values) => {
        try {
            setIsDisabled(true)
            await login(values.email, values.password);
            toast.success("Başarıyla Giriş Yapıldı!");
            navigate("/");
        } catch (error) {
            if (error.message === "Firebase: Error (auth/invalid-credential).") {
                toast.error("Yanlış Şifre");
            }
            else if (error.message === "Firebase: Error (auth/network-request-failed).") {
                toast.error("Bağlantı Hatası")
            }
            setIsDisabled(false)
        }
        finally {
            setIsDisabled(false)
        }
    };

    const changeValues = (values) => {
        setTheMail(values.target.value)
    }

    const handleGoogleLogin = async () => {
        try {
            setIsDisabled(true);
            await loginWithGoogle()
            toast.success("Google ile giriş yapıldı")
            navigate("/")

        } catch (error) {
            toast.error(error)
        } finally {
            setIsDisabled(false)
        }
    }

    const handleResetPassword = async () => {
        try {
            await passwordReset(theMail);
            toast.success("Şifre sıfırlama linki gönderildi");
        } catch (error) {
            if (error.message == "Firebase: Error (auth/missing-email).") {
                toast.error("Lütfen bir email sağlayın")
            }
            else if (error.message == "Firebase: Error (auth/invalid-email).") {
                toast.error("Geçersiz email")
            }
            else {
                toast.error(error.message)
            }
        }
    };

    return (
        <div>
            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={20} sm={16} md={12} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: +5 }}
                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <Title level={2} style={{ color: '#ffffff' }}>Giriş Yap</Title>
                        </div>
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}

                            size="large"
                            onChange={changeValues}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'E-posta zorunlu' },
                                    { type: 'email', message: 'Geçerli bir e-posta girin' },
                                ]}
                            >
                                <Input placeholder="E-posta Adresi" style={{ background: 'transparent' }} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Şifre zorunlu' }]}
                            >
                                <Input.Password placeholder="Şifre" style={{ background: 'transparent' }} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='login-btn' style={{ width: '100%' }}>
                                    Giriş Yap
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button disabled={isDisabled} onClick={handleGoogleLogin} style={{ width: '100%' }} icon={<GoogleOutlined />} className='custom-google-btn' >Google ile Giriş yap</Button>
                            </Form.Item>

                            <div style={{ color: '#ffffff', textAlign: 'center' }}>
                                Hesabın yok mu? <Link to="/register" style={{ color: '#ffffff' }}>Kayıt Ol</Link>
                            </div>
                            <div style={{ color: '#ffffff', textAlign: 'center' }}>
                                Şifreni mi unuttun? <Button type="link" onClick={handleResetPassword} style={{ color: '#ffffff' }}>Şifreyi Sıfırla</Button>
                            </div>
                        </Form>
                    </motion.div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
