/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Temizlik fonksiyonu
        return unsubscribe;
    }, []);

    // Cookie'ye kullanıcı bilgilerini kaydetme
    useEffect(() => {
        if (currentUser) {
            cookies.set('user', currentUser, { path: '/' });
        } else {
            cookies.remove('user', { path: '/' });
        }
    }, [currentUser]);

    // Kayıt işlemi
    function register(email, password, username) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Oluşturulan kullanıcı bilgilerini al
                    const user = userCredential.user;
                    // displayName'i güncelle
                    updateProfile(user, {
                        displayName: username
                    }).then(() => {
                        // Kullanıcı oluşturma ve displayName güncelleme başarılı
                        setCurrentUser(user);
                        resolve(user);
                    }).catch((error) => {
                        // displayName güncelleme hatası
                        reject(error);
                    });
                })
                .catch((error) => {
                    // Kullanıcı oluşturma hatası
                    reject(error);
                });
        });
    }

    // Google ile giriş
    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                setCurrentUser(result.user);
            });
    }

    // Giriş işlemi
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                setCurrentUser(result.user);
            });
    }

    // Çıkış işlemi
    function logout() {
        return auth.signOut()
            .then(() => {
                setCurrentUser(null);
            });
    }

    // Şifre değiştirme
    function changePassword(newPassword) {
        return updatePassword(auth.currentUser, newPassword);
    }

    // Mail doğrulama
    function verifyEmail() {
        return sendEmailVerification(auth.currentUser);
    }

    // Şifre sıfırlama linki gönderme
    function passwordReset(email) {
        return sendPasswordResetEmail(auth, email);
    }

    // Profil güncelleme
    function updateProfilePicture(url) {
        updateProfile(currentUser, {
            photoURL: url
        });
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        changePassword,
        verifyEmail,
        passwordReset,
        updateProfilePicture,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
