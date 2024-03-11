import { useState } from 'react';
import { Card, Avatar, Input, Button, Row, Col, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ChangeProfileImage from '../components/ChangeProfileImage';
import VerifyEmailButton from '../components/VerifyEmailButton';
import SignOutButton from '../components/SignOutButton';
import { useAuth } from '../contexts/authContext';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigater from '../components/Navigater';

const { Meta } = Card;
const { Title } = Typography;

const Home = () => {
    const { currentUser, changePassword } = useAuth()
    const [newPassword, setNewPassword] = useState('');
    const [image, setImage] = useState(currentUser ? currentUser.photoURL : "")
    const [isGoogleAuth] = useState(currentUser ? currentUser.providerData[0].providerId == "password" ? true : false : null)


    const handlePasswordChange = async () => {
        try {
            if (isGoogleAuth) {
                if (newPassword <= 6) {
                    toast.error("Şifre en az 6 karakter olmalı")
                } else {
                    await changePassword(newPassword)
                    toast.success("Şifre başarıyla değişti")
                    setNewPassword('');
                }

            } else {
                toast("Google ile giriş yaptığınız için şifrenizi değiştiremessiniz!", {
                    icon: '🔍',
                    style: { color: "#ffffff", background: "#2b2b2b" }
                })
            }
        } catch (error) {
            toast.error(error)
        }
    };

    return (
        <div>
            {currentUser ? <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                    <motion.div
                        style={{ display: 'flex', justifyContent: 'center' }}
                        initial={{ opacity: 0, y: +5 }}
                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        <Card className="text-center" style={{ width: '100%', backdropFilter: blur("15px"), backgroundColor: " rgba(255, 255, 255, 0.1) " }}>
                            <div className="mb-4">
                                <motion.div
                                    key={image} // image değiştiğinde bileşenin tamamen yeniden oluşturulmasını sağlar
                                    initial={{ opacity: 0, scale: 0 }} // Başlangıçta küçük ve görünmez
                                    animate={{ opacity: 1, scale: 1 }} // Son halde büyük ve görünür
                                    transition={{ duration: .5 }} // Geçiş süresi
                                >
                                    {image ? (
                                        <Avatar size={150} src={image} />
                                    ) : (
                                        <Avatar size={150} icon={<UserOutlined />} />
                                    )}
                                </motion.div>
                            </div>
                            <Meta title={<Title level={2}>{currentUser ? currentUser.displayName : ""}</Title>} /> {/* Change with actual user data */}
                            <ChangeProfileImage setImage={setImage} />
                            <div className="mt-3">
                                <Title level={3}>Şifre Değiştir</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input.Password
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Yeni Şifre"
                                        className='changePassword '
                                        disabled={!isGoogleAuth}
                                    />
                                    <Button
                                        type="primary"
                                        block
                                        onClick={handlePasswordChange}
                                        className='change-password-btn'
                                    >
                                        Şifre Değiştir
                                    </Button>
                                </Space>
                            </div>
                            <div className="mt-4">
                                <Space size="middle">
                                    <VerifyEmailButton />
                                    <SignOutButton />
                                </Space>
                            </div>
                        </Card>

                    </motion.div>
                    <Navigater to={"/chat"} text={"Sohbete Git"} />
                </Col>
            </Row>
                :
                <Navigate to={"/login"} />
            }

        </div>
    );
};

export default Home;
