/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { database, storage } from '../firebase/Firebase';
import { ref, onValue, off, set, push, remove } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = database;
        const messagesRef = ref(db, 'messages');

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const messagesData = snapshot.val();
            if (messagesData) {
                const messagesList = Object.values(messagesData);
                setMessages(messagesList);
                setLoading(false);
            } else {
                setMessages([]);
                setLoading(false);
            }
        });

        return () => {
            off(messagesRef, 'value', unsubscribe);
        };
    }, []);

    const sendMessage = async (messageContent, user) => {
        const db = database;
        const messagesRef = ref(db, 'messages');
        const newMessageRef = push(messagesRef);

        if (messageContent.image) {
            try {
                const imageRef = storageRef(storage, `images/${newMessageRef.key}`);
                const fileSnapshot = await uploadBytes(imageRef, messageContent.image);
                const imageUrl = await getDownloadURL(fileSnapshot.ref);
                messageContent.image = imageUrl;
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        const newMessage = {
            text: messageContent.text,
            user: user,
            timestamp: Date.now(),
            photo: messageContent.photoURL,
            image: messageContent.image || null,
        };
        set(newMessageRef, newMessage);
    };

    const deleteMessage = () => {
        const db = database;
        const messagesRef = ref(db, 'messages');
        remove(messagesRef);
    };

    const value = {
        messages,
        loading,
        sendMessage,
        deleteMessage,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}
