/* eslint-disable react/prop-types */
import { Image } from "antd";
import { motion } from "framer-motion";

const Message = (props) => {
    const dateObject = new Date(props.timestamp);
    const time = dateObject.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });



    return (
        <div>
            {props.isUserMe ? (
                <motion.div
                    className="flex  gap-2.5 mb-3 mr-10 justify-end"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                    <div className={`text-ellipsis flex flex-col w-full xl:max-w-[320px] lg:max-w-[280px] md:max-w-[240px] sm:max-w-[200px] xs:max-w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-br-xl rounded-tl-xl rounded-bl-xl ${props.isUserMe ? "dark:bg-gray-800" : "dark:bg-gray-900"}`}>
                        <div className="flex justify-end items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{props.user}</span>
                        </div>
                        <p className="break-words text-ellipsis text-sm font-normal py-2.5 text-gray-900 dark:text-white text-end">{props.content}</p>
                        {props.image && (
                            <Image className="w-full max-h-72 object-contain rounded mt-2" src={props.image} alt="Gönderilen Resim" />
                        )}
                    </div>
                    <img className="w-8 h-8 rounded-full" src={props.avatar} alt="Kullanıcı Profil Resmi" />
                </motion.div>
            ) : (
                <motion.div
                    className="flex gap-2.5 mb-3 mr-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                    <img className="w-8 h-8 rounded-full" src={props.avatar} alt="Kullanıcı Profil Resmi" />
                    <div className={` text-ellipsis flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl ${props.isUserMe ? "dark:bg-gray-800" : "dark:bg-gray-900"}`}>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{props.user}</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>
                        </div>
                        <p className="break-words text-ellipsis text-sm font-normal py-2.5 text-gray-900 dark:text-white">{props.content}</p>
                        {props.image && (
                            <Image className="w-full max-h-72 object-contain rounded mt-2" src={props.image} alt="Gönderilen Resim" />
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Message;
