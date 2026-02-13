import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import Tags from "./pages/Tags";
import Redirects from "./pages/Redirects";
import Footer from "./components/Footer";
import HelpPanel from "./components/HelpPanel";

function App() {
    const [helpPanelState, setHelpPanelState] = useState({ isOpen: false, activePage: 'docs' });
    const location = useLocation();

    useEffect(() => {
        document.title = "Linkly | Secure URL Shortener";
        const favicon = document.querySelector("link[rel*='icon']");
        if (favicon) {
            favicon.href = "/favicon.svg";
        }
    }, []);

    const openHelp = (page) => {
        setHelpPanelState({ isOpen: true, activePage: page });
    };

    const closeHelp = () => {
        setHelpPanelState(prev => ({ ...prev, isOpen: false }));
    };

    const showFooter = !["/qr", "/dashboard", "/tags", "/redirects"].includes(location.pathname);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary text-white relative flex flex-col">
            <div className="bg-noise pointer-events-none"></div>
            <Navbar />
            <div className="flex-grow w-full relative z-10">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/qr" element={<QRCodeGenerator />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tags"
                        element={
                            <ProtectedRoute>
                                <Tags />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/redirects"
                        element={
                            <ProtectedRoute>
                                <Redirects />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
            {showFooter && <Footer onOpenHelp={openHelp} />}

            <HelpPanel
                isOpen={helpPanelState.isOpen}
                onClose={closeHelp}
                activePage={helpPanelState.activePage}
            />

            <Toaster position="bottom-center" />
        </div>
    );
}

export default App;
