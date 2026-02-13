import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
            toast.success("Signed in with Google");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Google login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[32px] p-10 shadow-glass relative overflow-hidden group"
            >
                {/* Accent Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-500"></div>

                <div className="mb-10 text-center relative z-10">
                    <div className="text-xs text-secondary uppercase tracking-[0.2em] mb-4 font-semibold opacity-70">WELCOME BACK</div>
                    <h2 className="text-4xl font-bold mb-3 text-white tracking-tight leading-tight">Sign In.</h2>
                    <p className="text-secondary text-sm font-light">Access your Linkly workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 focus:shadow-glow-purple-sm transition-all text-base"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 focus:shadow-glow-purple-sm transition-all text-base"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-glow-purple-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn shadow-lg"
                        >
                            <span className="relative z-10">{loading ? "Verifying..." : "Enter Dashboard"}</span>
                            {!loading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform relative z-10" />}
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-glass-border"></div>
                            <span className="flex-shrink mx-4 text-xs text-tertiary uppercase tracking-widest font-bold">OR</span>
                            <div className="flex-grow border-t border-glass-border"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Login Failed")}
                                theme="filled_black"
                                shape="pill"
                            />
                        </div>
                    </div>
                </form>

                <div className="text-center mt-10 relative z-10">
                    <p className="text-secondary text-sm font-light">
                        New here?{" "}
                        <Link to="/register" className="text-accent-light hover:text-accent font-medium transition-colors hover:underline underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
