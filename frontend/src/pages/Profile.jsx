import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Activity } from "lucide-react";

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-center mt-20 text-white animate-pulse text-sm">Syncing profile...</div>;

    const stats = [
        { label: "Joined", value: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Calendar, color: "text-blue-400" },
        { label: "Account", value: user.googleId ? "Google" : "Standard", icon: Shield, color: "text-green-400" },
        { label: "Status", value: "Verified", icon: Activity, color: "text-accent-light" },
    ];

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 sm:px-6 py-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[24px] overflow-hidden shadow-glass relative"
            >
                <div className="p-6 sm:p-8 relative z-10">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent-dark/40 border border-glass-border flex items-center justify-center shadow-inner">
                                <User size={28} className="text-white opacity-80" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{user.username}</h2>
                            <p className="text-secondary text-xs font-medium flex items-center gap-2">
                                <Mail size={12} className="opacity-60" />
                                {user.email}
                            </p>
                            <div className="pt-2">
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold uppercase tracking-wider text-tertiary">
                                    Member
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-black/20 border border-glass-border rounded-xl p-3 hover:bg-white/5 transition-colors group/stat">
                                <stat.icon size={14} className={`${stat.color} mb-2 group-hover/stat:scale-110 transition-transform`} />
                                <p className="text-[9px] text-tertiary uppercase font-bold tracking-wider mb-0.5">{stat.label}</p>
                                <p className="text-white text-xs font-semibold">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 border-t border-glass-border pt-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-light mb-4">Security</h3>
                        <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-glass-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                    <Shield size={16} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Recovery Method</p>
                                    <p className="text-[9px] text-secondary">Security questions active</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest px-2 py-0.5 bg-green-500/10 rounded">Enabled</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
