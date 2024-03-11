import { useAuth } from '../contexts/authContext';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await logout();
            navigate("/login");
            toast.success("Çıkış Yapıldı")
        } catch (error) {
            console.error('Çıkış yaparken bir hata oluştu:', error);
        }
    };

    return (
        <Button variant='danger' onClick={handleSignOut}>
            Çıkış Yap
        </Button>
    );
};

export default SignOutButton;
