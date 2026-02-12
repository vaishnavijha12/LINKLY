import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ArrowRight, Tag, Copy, Check, BarChart3, ShieldCheck, Globe } from "lucide-react";
import api, { BACKEND_URL } from "../utils/api";
import { toast } from "react-hot-toast";
import FeatureCard from "../components/FeatureCard";
import CreateCustomLinkModal from "../components/CreateCustomLinkModal";

const Home = () => {
    const [url, setUrl] = useState("");
    const [tag, setTag] = useState("");
    const [shortUrl, setShortUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [activeCardState, setActiveCardState] = useState(0); // 0: Link, 1: Stats, 2: Security
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCardState((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        if (token && username) {
            setUser({ username });
        }
    }, []);

    const handleShorten = async (e) => {
        e?.preventDefault();
        if (!url) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to shorten URLs");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.post("/create", {
                originalUrl: url,
                tags: tag ? [tag] : []
            });
            setShortUrl(data.shortUrl);
            toast.success("Link shortened!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to shorten URL");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${BACKEND_URL}/${shortUrl}`);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
        toast.success("Logged out");
        navigate("/login");
    };

    const handleModalSuccess = (newShortUrl) => {
        setShortUrl(newShortUrl);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const features = [
        {
            title: "Quick Shortener",
            description: "Paste, click, done. Get a short link in seconds.",
            icon: Link2,
            onClick: scrollToTop
        },
        {
            title: "Branded / Custom Links",
            description: "Create memorable, branded short links with custom aliases.",
            icon: Tag,
            onClick: () => setIsModalOpen(true)
        },
        {
            title: "Redirects",
            description: "Manage and update where your links point, anytime.",
            icon: ArrowRight,
            link: "/redirects"
        },
        {
            title: "QR Codes",
            description: "Generate QR codes for your links instantly.",
            icon: Copy,
            link: "/qr"
        },
        {
            title: "Dashboard",
            description: "Track clicks, manage links, and view analytics.",
            icon: Check,
            link: "/dashboard"
        },
        {
            title: "Tags & Organization",
            description: "Organize links by tags and filter easily.",
            icon: Tag,
            link: "/tags"
        }
    ];

    return (
        <div className="selection:bg-accent/30 overflow-x-hidden">
            {/* Main Full-Width Hero Container */}
            <div className="relative z-10 min-h-[95vh] flex items-center justify-center py-20 px-6 lg:px-12">
                {/* Immersive Background Glows (not constrained by a box) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] pointer-events-none -z-10">
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-[1440px] w-full mx-auto">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                        {/* LEFT: Content & Tool (Expansive) */}
                        <div className="space-y-10 lg:pr-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-6 text-center lg:text-left"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tight">
                                    Shorten with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Vision.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    Turn long, cluttered links into beautiful, trackable assets. Built for impact and visibility.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="max-w-xl mx-auto lg:mx-0"
                            >
                                {!shortUrl ? (
                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <input
                                                id="url-input"
                                                type="text"
                                                placeholder="Paste a link to shorten..."
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleShorten(e)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all text-xl pr-16 shadow-2xl backdrop-blur-sm"
                                                disabled={loading}
                                            />
                                            <button
                                                onClick={handleShorten}
                                                disabled={loading}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-accent text-white rounded-xl hover:bg-accent-light transition-all duration-200 disabled:opacity-50"
                                            >
                                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowRight size={24} />}
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="relative flex-1 group">
                                                <input
                                                    type="text"
                                                    placeholder="Tag (optional)"
                                                    value={tag}
                                                    onChange={(e) => setTag(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/40 transition-all text-base pr-12 backdrop-blur-sm"
                                                    disabled={loading}
                                                />
                                                <Tag size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent transition-colors" />
                                            </div>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="px-8 py-4 bg-glass-bg border border-glass-border rounded-2xl text-secondary hover:text-white hover:border-accent/50 transition-all text-sm font-bold uppercase tracking-widest backdrop-blur-sm shadow-xl"
                                            >
                                                Branded Link
                                            </button>
                                        </div>

                                        <p className="text-secondary text-sm flex items-center justify-center lg:justify-start gap-3 opacity-60">
                                            <Check size={14} className="text-green-400" />
                                            No tracking • No ads • Reliable for life
                                        </p>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm space-y-4"
                                    >
                                        <p className="text-sm text-tertiary">Your shortened URL:</p>
                                        <div className="flex items-center justify-between bg-white/10 rounded-xl pr-2">
                                            <a
                                                href={`${BACKEND_URL}/${shortUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-3 text-white text-lg truncate hover:text-accent transition-colors"
                                            >
                                                {BACKEND_URL}/{shortUrl}
                                            </a>
                                            <button
                                                onClick={handleCopy}
                                                className="p-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-all duration-200"
                                            >
                                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setShortUrl(null)}
                                            className="w-full py-3 text-accent-light hover:text-accent transition-colors font-medium"
                                        >
                                            Shorten another link
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* RIGHT: High-Energy Depth Jump Carousel */}
                        <div className="hidden lg:flex items-center justify-center relative h-[600px] perspective-[2500px]">
                            {[2, 1, 0].map((offset) => {
                                // Calculate position in the carousel
                                const index = (activeCardState + offset) % 3;
                                const isActive = offset === 0;
                                const isNext = offset === 1;
                                const isThird = offset === 2;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1 : (isNext ? 0.85 : 0.7),
                                            z: isActive ? 0 : (isNext ? -250 : -500),
                                            y: isActive ? 0 : (isNext ? -50 : -100),
                                            x: isActive ? 0 : (isNext ? 40 : 80),
                                            opacity: isActive ? 1 : (isNext ? 0.6 : 0.2),
                                            rotateY: isActive ? -15 : -30,
                                            rotateX: isActive ? 5 : 10,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 20,
                                            mass: 1,
                                            duration: 0.6
                                        }}
                                        className={`absolute w-full max-w-[480px] aspect-[4/5] rounded-[48px] p-12 transition-all duration-300 transform-gpu cursor-pointer
                                            ${isActive ? 'z-30 bg-gradient-to-br from-glass-bg to-black/90 border border-accent/40 shadow-glow-purple ring-1 ring-white/10' :
                                                isNext ? 'z-20 bg-glass-bg/80 border border-glass-border shadow-2xl' :
                                                    'z-10 bg-glass-bg/40 border-none shadow-none grayscale opacity-10'}`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Dynamic Content based on which card is at the index */}
                                        {index === 0 && (
                                            <div className="h-full flex flex-col justify-between">
                                                <div className="space-y-8">
                                                    <div className="flex items-center justify-between">
                                                        <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center shadow-glow-purple ring-1 ring-white/20">
                                                            <Link2 size={32} className="text-white" />
                                                        </div>
                                                        <div className="px-5 py-2 bg-accent/20 rounded-full border border-accent/30 text-xs text-accent-light font-black uppercase tracking-[0.2em]">
                                                            Branded
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h3 className="text-4xl font-black text-white leading-tight underline decoration-accent/40 underline-offset-8">link.ly/offer</h3>
                                                        <p className="text-secondary text-lg font-medium leading-[1.6]">Performance-optimized branded links for global distribution.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-[32px] p-6 shadow-2xl mt-8">
                                                    <div className="w-full h-40 bg-black/5 flex items-center justify-center border-2 border-dashed border-black/10 rounded-2xl">
                                                        <Globe size={64} className="text-black/10 animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {index === 1 && (
                                            <div className="h-full flex flex-col justify-between">
                                                <div className="space-y-8">
                                                    <div className="flex items-center justify-between">
                                                        <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-glow-blue ring-1 ring-white/20">
                                                            <BarChart3 size={32} className="text-white" />
                                                        </div>
                                                        <div className="px-5 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-xs text-indigo-400 font-black uppercase tracking-[0.2em]">
                                                            Live Stats
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h3 className="text-4xl font-black text-white leading-tight">1.2M Clicks</h3>
                                                        <p className="text-secondary text-lg font-medium">Real-time geographic and platform analytics delivered instantly.</p>
                                                    </div>
                                                </div>
                                                <div className="h-48 flex items-end gap-3 px-2">
                                                    {[50, 80, 45, 95, 65, 100, 85].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            className="flex-1 bg-gradient-to-t from-accent/50 to-accent rounded-t-xl"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {index === 2 && (
                                            <div className="h-full flex flex-col justify-between">
                                                <div className="space-y-8">
                                                    <div className="flex items-center justify-between">
                                                        <div className="w-16 h-16 rounded-3xl bg-green-500 flex items-center justify-center shadow-glow-green ring-1 ring-white/20">
                                                            <ShieldCheck size={32} className="text-white" />
                                                        </div>
                                                        <div className="px-5 py-2 bg-green-500/20 rounded-full border border-green-500/30 text-xs text-green-400 font-black uppercase tracking-[0.2em]">
                                                            Verified
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h3 className="text-4xl font-black text-white leading-tight">Secure Infrastructure</h3>
                                                        <p className="text-secondary text-lg font-medium leading-[1.6]">Enterprise-grade encryption and phishing protection for every link.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {[1, 2, 3].map((_, i) => (
                                                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-2xl px-6 py-4 border border-white/10 ring-1 ring-white/5">
                                                            <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                                                            <Check size={18} className="text-green-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Premium Floating Micro-Animation */}
                                        <motion.div
                                            animate={{
                                                y: [0, -15, 0],
                                                rotate: [0, 1, 0]
                                            }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 pointer-events-none rounded-[48px] border-2 border-white/5"
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue with existing sections below */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* SECTION 2: CONTEXT */}
                <section className="py-20 flex flex-col items-center text-center">
                    <h2 className="text-section md:text-section-lg font-semibold mb-6 text-white">
                        This is more than a short link.
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                        Organize, customize, and manage everything in one place.
                        Turn your links into powerful tools for your workflow.
                    </p>
                </section>

                {/* SECTION 3: EXPLORE FEATURES */}
                <section className="py-20">
                    <div className="mb-12">
                        <h2 className="text-section md:text-section-lg font-semibold text-white">
                            Explore Features
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))}
                    </div>
                </section>

                {/* SECTION 4: QUICK ACCESS / FLOW */}
                <section className="py-20 flex flex-col items-center text-center">
                    <h3 className="text-xl font-medium text-white mb-10">Pick a tool to continue.</h3>
                    <div className="flex gap-5">
                        <Link
                            to="/dashboard"
                            className="px-10 py-4 rounded-full font-semibold border border-glass-border bg-glass-bg text-white hover:border-accent/30 hover:shadow-glow-purple-sm transition-all duration-200"
                        >
                            View All Links
                        </Link>
                    </div>
                </section>
            </div>

            <CreateCustomLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default Home;
