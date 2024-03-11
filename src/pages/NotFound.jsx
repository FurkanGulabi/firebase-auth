import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const [countdown, setCountdown] = useState(4);
    const navigate = useNavigate();

    // Geriye doğru sayma
    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            }
        }, 1000);

        // Temizlik
        return () => clearTimeout(timer);
    }, [countdown]);

    // Sayfaya yönlendirme
    useEffect(() => {
        if (countdown === 0) {
            navigate("/");
        }
    }, [countdown, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-3xl mb-4 text-white">Aradığınız sayfa bulunmamaktadır.</p>
                <p className="text-2xl text-white-50">{countdown} Saniye içinde yönlendiriliyorsunuz...</p>
            </div>
        </div>
    );
};

export default NotFound;
