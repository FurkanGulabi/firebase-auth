import { Button } from 'antd';
import { useChat } from '../contexts/chatContext';
import { useAuth } from '../contexts/authContext';



const DeleteMessages = () => {
    const { deleteMessage } = useChat()
    const { currentUser } = useAuth()

    const handleDeleteMessage = async () => {
        deleteMessage()
    }

    return (

        <>
            {currentUser.email === "furkangulabi162@gmail.com" ? (
                <Button onClick={handleDeleteMessage} className="fixed top-9 right-0 z-50 m-10 w-24 text-center nav-btn">Mesajları sil</Button>
            ) : (
                <div></div>
            )}
        </>
    );
}

export default DeleteMessages;
