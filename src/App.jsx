/* eslint-disable react/prop-types */
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Copyrigt from "./components/Copyrigt";
import { AnimatePresence } from "framer-motion";
//import { useMediaQuery } from "react-responsive";
// import MobileBackground from "./components/MobileBackground"
import { GradientBackground } from "./components/GradientBackground";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import { AuthProvider } from "./contexts/authContext";
import { ChatProvider } from "./contexts/chatContext";
import Navigater from "./components/Navigater";


const App = () => {
  return (
    <div className="main-element-for-app">
      <AnimatePresence>
        <GradientBackground />
        <Toaster position="top-center" toastOptions={{
          success: { style: { color: "#ffffff", background: "#2b2b2b" }, },
          custom: { style: { color: "#ffffff", background: "#2b2b2b" }, },
          error: { style: { color: "#ffffff", background: "#6B2737", } },
        }}
        />
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
        <Copyrigt />
      </AnimatePresence>
    </div>
  );
};

export default App;
