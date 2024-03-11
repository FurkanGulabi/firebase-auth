import { useEffect, useRef, useState } from 'react';
import { Input, Button, Row, Col, Space, Upload } from 'antd';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { useChat } from '../contexts/chatContext';
import Message from '../components/Message';
import '../style/Chat.css';
import { Navigate } from 'react-router-dom';
import Navigater from '../components/Navigater';
import toast from 'react-hot-toast';
import DeleteMessages from '../components/DeleteMessages';

const Chat = () => {
    const { currentUser } = useAuth();
    const { messages, sendMessage } = useChat();
    const [newMessage, setNewMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const messagesEndRef = useRef();
    const [lastMessageTime, setLastMessageTime] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isSending, setIsSending] = useState(false); // Durum ekleyin

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            console.log(messagesEndRef);

        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !imageFile) return;

        if (newMessage.length > 250) {
            toast.error("Mesajınız 250 karakterden uzun olamaz.");
            return;
        }

        const now = new Date().getTime();
        if (lastMessageTime && now - lastMessageTime < 1000) {
            toast.error("Lütfen bir saniye bekleyin.");
            return;
        }

        // Mesaj içeriği oluştu
        setIsSending(true); // Gönderme başladığında düğmeyi devre dışı bırak


        try {
            let messageContent = { text: newMessage, photoURL: currentUser.photoURL ? currentUser.photoURL : "https://i.pinimg.com/736x/81/8a/1b/818a1b89a57c2ee0fb7619b95e11aebd.jpg" };

            if (imageFile) {
                const resizedImage = await resizeImage(imageFile);
                messageContent = { ...messageContent, image: resizedImage };
            }

            await sendMessage(messageContent, currentUser.displayName);
            setLastMessageTime(now);
            setNewMessage("");
            setImageFile(null);
            setPreviewImage(null);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Mesaj gönderilirken bir hata oluştu");
        } finally {
            setIsSending(false);
        }
    };

    const handleFileChange = (file) => {
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);

        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const image = new Image();
                image.src = event.target.result;
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800;
                    const maxHeight = 600;
                    let width = image.width;
                    let height = image.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, 0.7); // 0.7 kalite
                };
            };
            reader.readAsDataURL(file);
        });
    };


    return (
        <div>
            {currentUser ?
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Navigater to={"/"} text={"Panele Git"} />
                    <DeleteMessages />
                    <Col xs={24} sm={20} md={16} lg={12} xl={19}>
                        <motion.div
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '2px solid white', padding: "50px", borderRadius: "30px" }}
                            initial={{ opacity: 0, y: +5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            <div style={{ marginBottom: '20px', height: '50vh', overflowY: 'scroll' }}>
                                {messages.map((message, index) => (
                                    <Message
                                        key={index}
                                        isUserMe={message.user === currentUser.displayName ? true : false}
                                        content={message.text}
                                        avatar={message.photo}
                                        timestamp={message.timestamp}
                                        user={message.user}
                                        image={message.image}
                                    />
                                ))}
                                <div ref={messagesEndRef} /> {/* Scroll için referans */}
                            </div>
                            <div>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        value={newMessage}
                                        onPressEnter={handleSendMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className='send-message-input'
                                        placeholder="Mesajınızı yazın..."
                                    />
                                    <Upload
                                        accept=".jpg,.jpeg,.png"
                                        maxCount={1}
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleFileChange(file);
                                            return false;
                                        }}
                                    >
                                        <Button className='send-message-button'>Resim Yükle</Button>
                                    </Upload>
                                    <Button onClick={handleSendMessage} disabled={isSending} loading={isSending} className='send-message-button'>Gönder</Button>
                                </Space.Compact>
                                {previewImage && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            width={100}
                                            className='hover:opacity-50 transition-all'
                                            src={previewImage}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => { setPreviewImage(null); setImageFile(null); }}
                                        />
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </Col>
                </Row>
                : <Navigate to={"/"} />
            }
        </div>
    );
};

export default Chat;
