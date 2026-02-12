import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, loading: authLoading, updateUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put("/auth/profile", { username, email, password });
            toast.success(res.data.message);
            updateUser({ username, email });
            setPassword(""); // Clear password field
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-secondary hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="bg-glass-bg border border-glass-border p-10 rounded-[40px] shadow-glass backdrop-blur-glass relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 text-center mb-10">
                        <div className="w-24 h-24 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6 shadow-glow-purple-sm">
                            <User size={40} className="text-accent-light" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Profile Settings</h1>
                        <p className="text-secondary font-medium">Manage your Linkly account details</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-xs font-black uppercase tracking-widest text-accent-light mb-2 block ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User size={18} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-4 pl-12 rounded-2xl text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-xs font-black uppercase tracking-widest text-accent-light mb-2 block ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-4 pl-12 rounded-2xl text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-xs font-black uppercase tracking-widest text-accent-light mb-2 block ml-1">New Password (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-4 pl-12 rounded-2xl text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-accent to-accent-dark text-white p-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow-purple hover:scale-[1.02]'}`}
                        >
                            <Save size={18} />
                            <span>{loading ? "Updating..." : "Save Changes"}</span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
