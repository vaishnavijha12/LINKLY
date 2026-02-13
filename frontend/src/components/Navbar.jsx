import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link2, LogOut, User, Menu, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
        setIsMenuOpen(false);
        navigate("/login");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "QR Code", path: "/qr" },
        ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
    ];

    return (
        <nav className="glass-nav sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 md:py-6 flex justify-between items-center relative">
                {/* Subtle bottom glow */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-sm"></div>

                <Link to="/" className="flex items-center space-x-3 group hover-lift z-50">
                    <div className="bg-gradient-to-br from-accent to-accent-dark text-white p-2 md:p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-glow-purple-sm">
                        <Link2 size={20} className="md:w-6 md:h-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-tight animated-gradient-text">Linkly</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-secondary hover:text-white transition-colors text-sm font-medium relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-accent-light transition-all duration-200 group-hover:w-full"></span>
                        </Link>
                    ))}

                    {user ? (
                        <div className="flex items-center space-x-8 pl-8 border-l border-divider">
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center group-hover:border-accent/40 transition-all duration-200 shadow-glass backdrop-blur-glass">
                                    <User size={18} className="text-secondary group-hover:text-accent-light transition-colors" />
                                </div>
                                <span className="text-sm font-medium text-secondary group-hover:text-white transition-colors">{user.username}</span>
                            </Link>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="text-secondary hover:text-red-400 transition-all hover:scale-110 transform duration-200"
                                title="Logout"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-8">
                            <Link to="/login" className="text-secondary hover:text-white transition-colors text-sm font-medium hover-glow">Login</Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-accent to-accent-dark text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider hover:shadow-glow-purple-sm transition-all duration-200 hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white hover:text-accent transition-colors z-50 p-2"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full min-h-screen bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-10 md:hidden"
                        >
                            <div className="flex flex-col items-center space-y-8 w-full">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-2xl font-bold text-white hover:text-accent transition-colors tracking-tight"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {user ? (
                                    <div className="flex flex-col items-center space-y-8 w-full pt-8 border-t border-white/10">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex flex-col items-center space-y-3 group"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                                                <User size={32} className="text-accent-light" />
                                            </div>
                                            <span className="text-xl font-bold text-white">{user.username}</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors text-lg font-bold uppercase tracking-widest"
                                        >
                                            <LogOut size={20} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center space-y-6 w-full pt-8 border-t border-white/10">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-xl font-bold text-white hover:text-accent transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-4 rounded-2xl text-center text-lg font-black uppercase tracking-widest shadow-glow-purple-sm"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Logout Confirmation Modal */}
                <AnimatePresence>
                    {showLogoutModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowLogoutModal(false)}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                className="relative w-full max-w-[320px] bg-[#16161b] border border-glass-border rounded-2xl p-6 shadow-2xl text-center"
                            >
                                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={24} className="text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Confirm Logout</h3>
                                <p className="text-secondary text-xs mb-6">Are you sure you want to end your session?</p>
                                <div className="flex gap-2.5">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-lg border border-glass-border text-secondary text-xs font-bold uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 py-2.5 rounded-lg bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition-all shadow-lg shadow-red-500/10"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
