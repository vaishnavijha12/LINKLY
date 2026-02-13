import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/api"; // Added for username check endpoint

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, googleLogin } = useContext(AuthContext);
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
    const [usernameStatus, setUsernameStatus] = useState({ available: null, checking: false });
    const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-tertiary" });

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

    // Handle Username Uniqueness (Debounced)
    useEffect(() => {
        if (username.length < 3) {
            setUsernameStatus({ available: null, checking: false });
            return;
        }

        const timeoutId = setTimeout(async () => {
            setUsernameStatus({ available: null, checking: true });
            try {
                const { data } = await api.get(`/auth/check-username/${username}`);
                setUsernameStatus({ available: data.available, checking: false });
            } catch (error) {
                setUsernameStatus({ available: null, checking: false });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (usernameStatus.available === false) {
            toast.error("Username is already taken");
            return;
        }

        setLoading(true);
        try {
            await register(username, email, password);
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
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
                    <div className="text-xs text-secondary uppercase tracking-[0.2em] mb-4 font-semibold opacity-70">GET STARTED</div>
                    <h2 className="text-4xl font-bold mb-3 text-white tracking-tight leading-tight">Join Us.</h2>
                    <p className="text-secondary text-sm font-light">Shorten links with professional glass styling</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full bg-black/40 border ${usernameStatus.available === false ? 'border-red-500/50' : usernameStatus.available === true ? 'border-green-500/50' : 'border-glass-border'} rounded-xl px-5 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all text-base`}
                                placeholder="Username"
                                required
                            />
                            {usernameStatus.checking && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full"></div>}
                            {usernameStatus.available === true && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-xs font-bold">AVAILABLE</div>}
                            {usernameStatus.available === false && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold">TAKEN</div>}
                        </div>
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
                        <div className="relative space-y-3">
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all text-base"
                                placeholder="Password"
                                required
                            />

                            {password.length > 0 && (
                                <div className="px-1 space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-secondary">Password Strength</span>
                                        <span className={strength.score <= 1 ? "text-red-400" : strength.score <= 3 ? "text-yellow-400" : "text-green-400"}>
                                            {strength.label}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-full flex-1 transition-all duration-500 ${i < strength.score ? strength.color : 'bg-white/5'}`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-tertiary font-medium">Use 8+ characters with a mix of letters, numbers & symbols</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 space-y-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-glow-purple-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn shadow-lg"
                        >
                            <span className="relative z-10">{loading ? "Creating..." : "Create Account"}</span>
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
                        Already a member?{" "}
                        <Link to="/login" className="text-accent-light hover:text-accent font-medium transition-colors hover:underline underline-offset-4">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
