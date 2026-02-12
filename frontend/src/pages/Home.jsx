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
        <div className="selection:bg-accent/30">
            {/* Main App Container */}
            <div className="relative z-10 min-h-[90vh] flex items-center justify-center py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-7xl w-full bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[32px] shadow-glass overflow-visible relative group/main"
                >
                    {/* Immersive background glow */}
                    <div className="absolute -inset-20 bg-accent/5 rounded-[100px] blur-[120px] -z-10 group-hover/main:bg-accent/10 transition-colors duration-1000"></div>

                    {/* Main Split Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-0 p-8 md:p-16 items-center min-h-[600px]">
                        {/* LEFT: Tool Card (55%) */}
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-secondary uppercase tracking-widest mb-3 font-semibold">LINKLY</div>
                                <h1 className="text-3xl font-bold tracking-tight mb-3 text-white leading-tight">
                                    Shorten and manage your links instantly
                                </h1>
                            </div>

                            {!shortUrl ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            id="url-input"
                                            type="text"
                                            placeholder="Paste a link to shorten..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleShorten(e)}
                                            className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-3 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all text-base pr-14"
                                            disabled={loading}
                                        />
                                        <button
                                            onClick={handleShorten}
                                            disabled={loading}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg hover:shadow-glow-purple-sm transition-all duration-200 disabled:opacity-50 hover:scale-105"
                                        >
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowRight size={18} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Tag (optional)"
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-2.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all text-sm pr-10"
                                            disabled={loading}
                                        />
                                        <Tag size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary" />
                                    </div>

                                    {/* Trust Line */}
                                    <p className="text-secondary text-xs flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-accent"></span>
                                        No ads • No tracking • Links never expire
                                    </p>

                                    <p className="text-secondary text-sm pt-2">
                                        Need a custom alias? <button type="button" onClick={() => setIsModalOpen(true)} className="text-accent-light hover:text-accent hover:underline transition-colors font-medium">Create branded link →</button>
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-black/40 border border-accent/30 rounded-2xl p-8 shadow-glow-purple-sm space-y-4"
                                >
                                    <p className="text-xs text-secondary uppercase tracking-wider">Success!</p>
                                    <a href={`${BACKEND_URL}/${shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-xl text-white font-medium hover:underline truncate block animated-gradient-text">
                                        {BACKEND_URL.replace(/^https?:\/\//, '')}/{shortUrl}
                                    </a>

                                    {/* Action Affordance */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            onClick={handleCopy}
                                            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 ${copied ? 'bg-accent/20 text-accent-light' : 'bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-glow-purple-sm'}`}
                                        >
                                            <Copy size={16} />
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                        <a
                                            href={`${BACKEND_URL}/${shortUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-white hover:border-accent/30 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                                        >
                                            <ArrowRight size={16} />
                                            Open
                                        </a>
                                        <Link
                                            to="/qr"
                                            className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-white hover:border-accent/30 transition-all duration-200 text-sm font-medium"
                                        >
                                            QR
                                        </Link>
                                    </div>

                                    <button
                                        onClick={() => { setShortUrl(null); setUrl(''); setTag(''); }}
                                        className="text-secondary hover:text-white text-sm transition-colors pt-2"
                                    >
                                        ← Shorten Another
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT: Featured Dynamic Card */}
                        <div className="hidden lg:flex items-center justify-center relative h-full perspective-[2000px] py-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCardState}
                                    initial={{ opacity: 0, scale: 0.9, rotateY: 20, z: -100 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: -15, z: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, rotateY: -40, z: -200 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20,
                                        duration: 0.6
                                    }}
                                    className="relative w-full max-w-[450px] aspect-[4/5] bg-gradient-to-br from-glass-bg to-black/80 border border-glass-border rounded-[40px] p-10 shadow-3xl backdrop-blur-3xl transform-gpu group cursor-pointer"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {/* Ambient card glow */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-accent/40 to-transparent rounded-[40px] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>

                                    {activeCardState === 0 && (
                                        <div className="h-full flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-glow-purple">
                                                        <Link2 size={24} className="text-white" />
                                                    </div>
                                                    <div className="px-4 py-1.5 bg-accent/20 rounded-full border border-accent/30 text-[10px] text-accent-light font-bold uppercase tracking-widest">
                                                        Featured
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-2 underline decoration-accent/30">link.ly/summer-promo</h3>
                                                    <p className="text-secondary text-sm leading-relaxed">Branded link with automatic tracking and custom destination mapping.</p>
                                                </div>
                                            </div>

                                            <div className="bg-black/40 rounded-3xl p-6 border border-glass-border text-center">
                                                <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-4 p-2 flex items-center justify-center">
                                                    <div className="w-full h-full bg-black/5 flex items-center justify-center">
                                                        <Globe size={40} className="text-black/20" />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-secondary font-bold uppercase tracking-wider">Scannable QR Included</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeCardState === 1 && (
                                        <div className="h-full flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-glow-blue">
                                                        <BarChart3 size={24} className="text-white" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                        <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Live</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-1">Impact Analytics</h3>
                                                    <p className="text-secondary text-sm">Deep insights into link performance and visitor demographics.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-end justify-between h-32 gap-3 pb-2 pt-8">
                                                    {[40, 60, 35, 85, 55, 95, 75].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-lg"
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center bg-black/40 rounded-2xl p-4 border border-glass-border">
                                                    <div className="text-xs text-secondary font-medium uppercase tracking-tight">Daily Traffic</div>
                                                    <div className="text-xl font-bold text-white">+142% 📈</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeCardState === 2 && (
                                        <div className="h-full flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center shadow-glow-green">
                                                        <ShieldCheck size={24} className="text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-2">Secure & Verified</h3>
                                                    <p className="text-secondary text-sm leading-relaxed">Advanced protection against spam, phishing, and broken redirects.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {[
                                                    { label: "SSL Certification", active: true },
                                                    { label: "Spam Protection", active: true },
                                                    { label: "Broken Link Check", active: true },
                                                    { label: "Phishing Guard", active: true }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl px-5 py-3 border border-glass-border">
                                                        <span className="text-xs text-white font-medium">{item.label}</span>
                                                        <Check size={14} className="text-green-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Floating animation wrapper */}
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 pointer-events-none rounded-[40px] border-2 border-accent/20"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
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
