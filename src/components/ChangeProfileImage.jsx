/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/Firebase'; // Firebase storage'ı import ettik
import { useAuth } from '../contexts/authContext';

const ChangeProfileImage = ({ setImage }) => {
    const { currentUser, updateProfilePicture } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const handleUpload = async ({ file }) => {
        const newFileName = `${currentUser.email}_profile_picture`;

        // Fotoğrafı optimize etmek için canvas kullanımı
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = async function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Resim boyutunu küçültme
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);

            // Optimize edilmiş resmi base64 olarak al
            const optimizedImageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 kalite
            const optimizedImageFile = dataURLtoFile(optimizedImageDataUrl, newFileName);

            // Storage'a yükleme işlemi
            const storageRef = ref(storage, `profile_images/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, optimizedImageFile);

            try {
                setUploading(true);
                await uploadTask;

                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
                setImage(url)

                if (currentUser) {
                    // Auth kullanıcısının photoURL'ini güncelle
                    await updateProfilePicture(url);
                    message.success('Profil fotoğrafı güncellendi.');
                }
            } catch (error) {
                message.error(`${file.name} yüklenirken hata oluştu.`);
                console.error('Upload Error:', error);
            } finally {
                setUploading(false);
            }
        };
    };

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt25M = file.size / 1024 / 1024 < 25; // 25MB

        if (!isJpgOrPng) {
            message.error('Lütfen JPG/PNG formatında bir resim yükleyin.');
        }

        if (!isLt25M) {
            message.error('Lütfen 25MB\'dan daha küçük bir dosya yükleyin.');
        }

        return isJpgOrPng && isLt25M;
    };

    return (
        <div className='d-flex justify-content-center mt-3 mb-3'>
            <Upload
                beforeUpload={beforeUpload}
                customRequest={handleUpload}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />} loading={uploading} className='upload-btn'>
                    Profil Resmi Yükle
                </Button>
            </Upload>
        </div>
    );
};

export default ChangeProfileImage;
