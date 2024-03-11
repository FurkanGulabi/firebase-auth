/* eslint-disable no-unused-vars */
import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion';


const { Title } = Typography;

const Register = () => {
    const { loginWithGoogle } = useAuth()
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false)
    const [formValues, setFormValues] = useState("")
    const formRef = useRef();

    const handleValues = (values) => {
        setFormValues(values)
    }

    const onFinish = async (values) => {
        try {
            setIsDisabled(true);
            await register(values.email, values.password, values.username);
            toast.success("Başarıyla Kayıt Olundu!");
            navigate("/");
        } catch (error) {
            console.error(error.message); // Hata kontrolü
            if (error.message == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                toast.error("Şifre en az 6 haneli olmalı")
            }
        } finally {
            setIsDisabled(false);
        }
    };
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
    const onFinishFailed = () => {
        null
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
                            <Title level={2} style={{ color: '#ffffff' }}>Kayıt Ol</Title>
                        </div>
                        <Form
                            name="register"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            size="large"
                            onValuesChange={handleValues}
                            ref={formRef}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: 'Kullanıcı adı zorunlu' },
                                    { whitespace: true, message: 'Kullanıcı adı boş olamaz' },
                                    { min: 3, message: 'Kullanıcı adı en az 3 karakter olmalıdır' },
                                    { max: 16, message: 'Kullanıcı adı en fazla 16 karakter olabilir' },
                                    { pattern: /^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ ]+)*$/, message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir' },
                                    { pattern: /^[^\s].*[^\s]$/, message: 'Kullanıcı adı başlangıçta veya sonunda boşluk içeremez' },
                                ]}
                                validateFirst
                            >
                                <Input placeholder="Kullanıcı Adı" style={{ background: 'transparent' }} />
                            </Form.Item>



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
                                rules={[
                                    { required: true, message: 'Şifre zorunlu' },
                                    {
                                        validator: async (_, value) => {
                                            const username = formRef.current.getFieldValue('username');
                                            if (value && username === value) {
                                                return Promise.reject('Kullanıcı adı ile şifre aynı olamaz');
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Şifre" style={{ background: 'transparent' }} />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Şifre doğrulama zorunlu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Şifreler eşleşmiyor'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Şifreyi Doğrula" style={{ background: 'transparent' }} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" className='register-btn' htmlType="submit" style={{ width: '100%' }} disabled={isDisabled}>
                                    Kayıt Ol
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button disabled={isDisabled} onClick={handleGoogleLogin} style={{ width: '100%' }} icon={<GoogleOutlined />} className='custom-google-btn' >Google ile kayıt ol</Button>
                            </Form.Item>

                            <div style={{ color: '#ffffff', textAlign: 'center' }}>
                                Zaten hesabın var mı? <Link to="/login" style={{ color: '#ffffff' }}>Giriş yap</Link>
                            </div>
                        </Form>
                    </motion.div>
                </Col>
            </Row>
        </div>

    );
};

export default Register;
