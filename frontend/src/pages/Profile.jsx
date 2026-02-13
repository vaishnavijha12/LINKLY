import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Activity } from "lucide-react";

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-center mt-20 text-white animate-pulse">Loading experience...</div>;

    const stats = [
        { label: "Joined", value: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Calendar, color: "text-blue-400" },
        { label: "Account Type", value: user.googleId ? "Google Sync" : "Standard", icon: Shield, color: "text-green-400" },
        { label: "Status", value: "Verified", icon: Activity, color: "text-accent-light" },
    ];

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-4 sm:px-6 py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[32px] overflow-hidden shadow-glass relative group"
            >
                {/* Visual Flair */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="p-8 sm:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent-dark/40 border-2 border-glass-border flex items-center justify-center shadow-inner overflow-hidden">
                                <User size={48} className="text-white opacity-80" />
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></div>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{user.username}</h2>
                            <p className="text-secondary font-medium flex items-center justify-center md:justify-start gap-2">
                                <Mail size={14} className="opacity-60" />
                                {user.email}
                            </p>
                            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-tertiary">
                                    Member Profile
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-black/20 border border-glass-border rounded-2xl p-5 hover:bg-white/5 transition-colors group/stat">
                                <stat.icon size={18} className={`${stat.color} mb-3 group-hover/stat:scale-110 transition-transform`} />
                                <p className="text-[10px] text-tertiary uppercase font-black tracking-widest mb-1">{stat.label}</p>
                                <p className="text-white font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 border-t border-glass-border pt-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-light mb-6">Security & Recovery</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                        <Shield size={18} className="text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Recovery Method</p>
                                        <p className="text-[10px] text-secondary">Security questions are active</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest px-2 py-1 bg-green-500/10 rounded">Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
