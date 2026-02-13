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
    const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-tertiary" });
    const navigate = useNavigate();

    // Handle Password Strength
    const checkPasswordStrength = (pass) => {
        let score = 0;
        if (pass.length === 0) return { score: 0, label: "", color: "bg-tertiary" };
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
        const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

        return { score, label: labels[score], color: colors[score] };
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        setStrength(checkPasswordStrength(val));
    };

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password && password.length < 8) {
            toast.error("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

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
        <div className="min-h-[85vh] md:min-h-[90vh] flex items-center justify-center py-10 md:py-20 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-secondary hover:text-white mb-6 md:mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium">Back</span>
                </button>

                <div className="bg-glass-bg border border-glass-border p-6 sm:p-8 md:p-10 rounded-[32px] md:rounded-[40px] shadow-glass backdrop-blur-glass relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-12 -right-12 sm:-top-24 sm:-right-24 w-32 h-32 sm:w-48 sm:h-48 bg-accent/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 text-center mb-8 md:mb-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-glow-purple-sm">
                            <User size={30} className="text-accent-light sm:hidden" />
                            <User size={36} className="text-accent-light hidden sm:block md:hidden" />
                            <User size={40} className="text-accent-light hidden md:block" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 md:mb-2 tracking-tight">Profile Settings</h1>
                        <p className="text-secondary text-sm font-medium">Manage your Linkly account details</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-5 md:space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] uppercase tracking-widest text-accent-light mb-1.5 block ml-1 font-bold">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={16} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-3.5 pl-11 rounded-xl text-sm text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] uppercase tracking-widest text-accent-light mb-1.5 block ml-1 font-bold">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={16} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-3.5 pl-11 rounded-xl text-sm text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="relative space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-accent-light mb-1.5 block ml-1 font-bold">New Password (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-secondary group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-black/40 border border-glass-border focus:border-accent/60 p-3.5 pl-11 rounded-xl text-sm text-white outline-none transition-all placeholder:text-tertiary focus:ring-4 focus:ring-accent/5"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {password.length > 0 && (
                                    <div className="px-1 space-y-2">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                            <span className="text-secondary">Strength</span>
                                            <span className={strength.score <= 1 ? "text-red-400" : strength.score <= 3 ? "text-yellow-400" : "text-green-400"}>
                                                {strength.label}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-full flex-1 transition-all duration-500 ${i < strength.score ? strength.color : 'bg-white/5'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-accent to-accent-dark text-white p-4.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 transition-all duration-300 transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow-purple hover:scale-[1.02]'}`}
                        >
                            <Save size={16} />
                            <span>{loading ? "Updating..." : "Save Changes"}</span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
