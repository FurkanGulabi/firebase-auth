import { useAuth } from '../contexts/authContext';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const VerifyEmailButton = () => {
    const { currentUser, verifyEmail } = useAuth();


    const handleVerifyEmail = async () => {
        try {
            await verifyEmail();
            toast('Email doğrulama linki gönderildi. Lütfen kontrol edin.', {
                icon: '📥',
                style: {
                    maxWidth: '500px', // Maksimum genişlik
                    color: "#ffffff",
                    background: "#2b2b2b"
                },
            });
        } catch (error) {
            if (error.message == "Firebase: Error (auth/too-many-requests).") {
                toast.error("Çok fazla doğrulama maili gönderdiniz")
            }
        }
    };

    return (
        <div>
            {currentUser && !currentUser.emailVerified ? (
                <Button variant="primary" onClick={handleVerifyEmail}>
                    Email Doğrula
                </Button>
            ) : (<div>
                <Button disabled={true} variant="success">
                    Email Doğrulandı &#9989;
                </Button>
            </div>)}
        </div>
    );
};

export default VerifyEmailButton;
