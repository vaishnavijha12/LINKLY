import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link2, LogOut, User, Menu } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="glass-nav sticky top-0 z-50">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center relative">
                {/* Subtle bottom glow */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-sm"></div>

                <Link to="/" className="flex items-center space-x-3 group hover-lift">
                    <div className="bg-gradient-to-br from-accent to-accent-dark text-white p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-glow-purple-sm">
                        <Link2 size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight animated-gradient-text">Linkly</span>
                </Link>

                <div className="hidden md:flex items-center space-x-12">
                    <Link to="/" className="text-secondary hover:text-white transition-colors text-sm font-medium relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-accent-light transition-all duration-200 group-hover:w-full"></span>
                    </Link>
                    <Link to="/qr" className="text-secondary hover:text-white transition-colors text-sm font-medium relative group">
                        QR Code
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-accent-light transition-all duration-200 group-hover:w-full"></span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-secondary hover:text-white transition-colors text-sm font-medium relative group">
                                Dashboard
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-accent-light transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                            <div className="flex items-center space-x-8 pl-8 border-l border-divider">
                                <Link to="/profile" className="flex items-center space-x-3 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center group-hover:border-accent/40 transition-all duration-200 shadow-glass backdrop-blur-glass">
                                        <User size={18} className="text-secondary group-hover:text-accent-light transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-secondary group-hover:text-white transition-colors">{user.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-secondary hover:text-red-400 transition-all hover:scale-110 transform duration-200"
                                    title="Logout"
                                >
                                    <LogOut size={22} />
                                </button>
                            </div>
                        </>
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

                {/* Mobile Menu Icon (Placeholder) */}
                <button className="md:hidden text-white hover:text-accent transition-colors">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
