import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ArrowRight, Tag, Copy, Check, BarChart3, ShieldCheck, Globe, MoreHorizontal } from "lucide-react";
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
                        <div className="space-y-8 lg:pr-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-4 text-center lg:text-left"
                            >
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight">
                                    Shorten with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Vision.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all text-lg pr-16 shadow-2xl backdrop-blur-sm"
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
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/40 transition-all text-sm pr-12 backdrop-blur-sm"
                                                    disabled={loading}
                                                />
                                                <Tag size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent transition-colors" />
                                            </div>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="px-6 py-3.5 bg-glass-bg border border-glass-border rounded-2xl text-secondary hover:text-white hover:border-accent/50 transition-all text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-xl"
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
                                            scale: isActive ? 1 : (isNext ? 0.95 : 0.9),
                                            z: isActive ? 0 : (isNext ? -40 : -80),
                                            y: isActive ? 0 : (isNext ? -20 : -40),
                                            x: isActive ? 0 : (isNext ? 20 : 40),
                                            opacity: isActive ? 1 : (isNext ? 0.4 : 0.1),
                                            rotateY: isActive ? -12 : -18,
                                            rotateX: isActive ? 4 : 8,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut",
                                            opacity: { duration: 0.3 }
                                        }}
                                        className={`absolute w-full max-w-[480px] aspect-[4/5] rounded-[48px] p-12 transition-colors duration-500 transform-gpu cursor-pointer
                                            ${isActive ? 'z-30 bg-[#121217] border border-accent/40 shadow-glow-purple ring-1 ring-accent/20' :
                                                isNext ? 'z-20 bg-[#1a1a21] border border-glass-border shadow-xl' :
                                                    'z-10 bg-[#0a0a0c] border-none shadow-none grayscale-0 opacity-10'}`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Dynamic Content based on which card is at the index */}
                                        {index === 0 && (
                                            <div className="h-full flex flex-col space-y-6">
                                                {/* Header */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1">Your Links</h3>
                                                        <p className="text-tertiary text-xs">Last 24 hours</p>
                                                    </div>
                                                    <MoreHorizontal size={20} className="text-tertiary cursor-pointer hover:text-white transition-colors" />
                                                </div>

                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-[#1c1c24] border border-white/5 p-4 rounded-2xl">
                                                        <p className="text-tertiary text-xs mb-2">Link Clicks</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-black text-white">1,247</span>
                                                            <span className="text-accent-light text-[10px] font-bold">+12.5%</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#1c1c24] border border-white/5 p-4 rounded-2xl">
                                                        <p className="text-tertiary text-xs mb-2">Created Today</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-black text-white">8</span>
                                                            <span className="text-accent-light text-[10px] font-bold">+3 new</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chart */}
                                                <div className="bg-[#1c1c24] border border-white/5 p-5 rounded-2xl h-36 flex items-end justify-between gap-1.5">
                                                    {[40, 65, 35, 80, 55, 95, 75, 60].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            transition={{ delay: 0.1 * i, duration: 0.8, ease: "easeOut" }}
                                                            className="flex-1 bg-accent/60 rounded-lg hover:bg-accent transition-colors"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Link List */}
                                                <div className="space-y-3">
                                                    {[
                                                        { label: 'link.ly/offer', clicks: '127 clicks' },
                                                        { label: 'link.ly/resume', clicks: '89 clicks' },
                                                        { label: 'link.ly/github', clicks: '64 clicks' }
                                                    ].map((link, i) => (
                                                        <div key={i} className="flex items-center gap-4 bg-[#1c1c24] border border-white/5 p-3 rounded-2xl group hover:border-accent/30 transition-all cursor-pointer">
                                                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                                                                <Link2 size={16} className="text-accent" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-bold mb-0.5 group-hover:text-accent transition-colors">{link.label}</p>
                                                                <p className="text-tertiary text-[10px]">{link.clicks}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {index === 1 && (
                                            <div className="h-full flex flex-col space-y-6">
                                                {/* Header */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1">Global Impact</h3>
                                                        <p className="text-tertiary text-xs">Real-time tracking</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                                        <BarChart3 size={20} className="text-indigo-400" />
                                                    </div>
                                                </div>

                                                {/* Hero Stat */}
                                                <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl text-center">
                                                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Total Impressions</p>
                                                    <h3 className="text-5xl font-black text-white">1.4B+</h3>
                                                </div>

                                                {/* Geographic breakdown */}
                                                <div className="space-y-4 flex-1">
                                                    {[
                                                        { city: 'New York', val: 85, color: 'bg-indigo-500' },
                                                        { city: 'London', val: 65, color: 'bg-purple-500' },
                                                        { city: 'Tokyo', val: 45, color: 'bg-accent' }
                                                    ].map((loc, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                                                <span className="text-white">{loc.city}</span>
                                                                <span className="text-tertiary">{loc.val}%</span>
                                                            </div>
                                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${loc.val}%` }}
                                                                    transition={{ delay: 0.5 + (0.1 * i), duration: 1 }}
                                                                    className={`h-full ${loc.color}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {index === 2 && (
                                            <div className="h-full flex flex-col space-y-6">
                                                {/* Header */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1">Security Core</h3>
                                                        <p className="text-tertiary text-xs">Enterprise Shield Active</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                                        <ShieldCheck size={20} className="text-green-400" />
                                                    </div>
                                                </div>

                                                {/* Protection Stats */}
                                                <div className="flex gap-4">
                                                    <div className="flex-1 bg-green-500/5 border border-green-500/10 p-4 rounded-2xl text-center">
                                                        <p className="text-green-400 text-[10px] font-bold uppercase mb-1">Threats Blocked</p>
                                                        <p className="text-xl font-black text-white">42.8k</p>
                                                    </div>
                                                    <div className="flex-1 bg-green-500/5 border border-green-500/10 p-4 rounded-2xl text-center">
                                                        <p className="text-green-400 text-[10px] font-bold uppercase mb-1">Uptime</p>
                                                        <p className="text-xl font-black text-white">99.99%</p>
                                                    </div>
                                                </div>

                                                {/* Security Logs */}
                                                <div className="space-y-3 flex-1">
                                                    {[
                                                        { msg: 'SSL Certificate Verified', status: 'Secure' },
                                                        { msg: 'DDoS Protection Active', status: 'Live' },
                                                        { msg: 'Phishing Filter Updated', status: 'Updated' }
                                                    ].map((log, i) => (
                                                        <div key={i} className="flex items-center justify-between bg-[#1c1c24] border border-white/5 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                                <span className="text-white text-[11px] font-medium">{log.msg}</span>
                                                            </div>
                                                            <span className="text-green-400 text-[9px] font-black uppercase tracking-wider">{log.status}</span>
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
