import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock } from "lucide-react";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            setSecurityQuestion(data.securityQuestion);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "User not found");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/reset-password", { email, securityAnswer, newPassword });
            toast.success("Password reset successfully!");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-4 sm:px-6 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-glass relative overflow-hidden group"
            >
                {/* Accent Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-500"></div>

                <div className="mb-8 text-center relative z-10">
                    <div className="text-[10px] sm:text-xs text-secondary uppercase tracking-[0.2em] mb-3 font-bold opacity-70">RECOVERY</div>
                    <h2 className="text-3xl font-black mb-2 text-white tracking-tight">Reset Password.</h2>
                    <p className="text-secondary text-sm font-medium opacity-80">
                        {step === 1 ? "Enter your email to verify identity" : "Answer your security question"}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6 relative z-10">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm font-medium"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-glow-purple-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn shadow-lg"
                        >
                            <span>{loading ? "Verifying..." : "Continue"}</span>
                            {!loading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit} className="flex flex-col gap-5 relative z-10">
                        <div className="space-y-4">
                            <div className="bg-white/5 border border-glass-border rounded-xl p-4">
                                <p className="text-[10px] text-tertiary uppercase font-black tracking-widest mb-1 opacity-60">Security Question</p>
                                <p className="text-white text-sm font-semibold">{securityQuestion}</p>
                            </div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/50" size={18} />
                                <input
                                    type="text"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                    className="w-full bg-black/40 border border-glass-border rounded-xl pl-12 pr-5 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm font-medium"
                                    placeholder="Your Answer"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/50" size={18} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-glass-border rounded-xl pl-12 pr-5 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm font-medium"
                                    placeholder="New Password"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-glow-purple-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn shadow-lg"
                        >
                            <span>{loading ? "Resetting..." : "Reset Password"}</span>
                            {!loading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-tertiary text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={12} /> Back
                        </button>
                    </form>
                )}

                <div className="text-center mt-8 relative z-10">
                    <Link to="/login" className="text-secondary text-xs font-medium hover:text-accent transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
