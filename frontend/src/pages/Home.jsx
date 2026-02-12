import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, ArrowRight, Tag, Copy, Check } from "lucide-react";
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
    const navigate = useNavigate();

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
            <div className="relative z-10 pt-[70px] pb-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-7xl mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass overflow-hidden"
                >
                    {/* Main Split Panel - Tool Card + Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-[52%_48%] gap-0 p-8 md:p-12 items-center min-h-[550px]">
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
                                        Need a custom alias? <button type="button" onClick={() => setIsModalOpen(true)} className="text-accent-light hover:text-accent hover:underline transition-colors">Create branded link →</button>
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-black/40 border border-accent/30 rounded-xl p-6 shadow-glow-purple-sm space-y-4">
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
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center justify-center relative h-full min-h-[400px]">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="relative w-full h-fit flex items-center justify-center"
                                style={{ perspective: '1200px' }}
                            >
                                {/* Card 3: Bottom Layer (Success/System) */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotateX: [2, 4, 2],
                                        rotateY: [-15, -12, -15]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute transform -translate-x-12 translate-y-20 bg-black/40 border border-glass-border p-5 rounded-2xl w-64 backdrop-blur-md shadow-2xl group hover:border-accent/30 transition-colors"
                                    style={{
                                        rotateY: '-15deg',
                                        rotateX: '5deg',
                                        translateZ: '-50px'
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <div className="text-[10px] text-secondary uppercase tracking-widest font-bold">Systems Operational</div>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, delay: 0.8 }}
                                            className="h-full bg-accent"
                                        />
                                    </div>
                                </motion.div>

                                {/* Card 2: Middle Layer (Analytics) */}
                                <motion.div
                                    animate={{
                                        y: [0, -15, 0],
                                        rotateX: [2, 5, 2],
                                        rotateY: [-15, -10, -15]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute transform translate-x-16 -translate-y-12 bg-gradient-to-br from-glass-bg to-black/60 border border-accent/20 p-6 rounded-2xl w-64 backdrop-blur-xl shadow-glow-purple-sm z-10 group hover:border-accent/40 transition-colors"
                                    style={{
                                        rotateY: '-15deg',
                                        rotateX: '5deg',
                                        translateZ: '20px'
                                    }}
                                >
                                    <div className="text-[10px] text-accent uppercase tracking-widest font-bold mb-1">Real-time Analytics</div>
                                    <div className="text-3xl font-bold text-white mb-1">1,247</div>
                                    <div className="text-[10px] text-secondary">Total clicks tracked today</div>
                                    <div className="flex gap-1 mt-4">
                                        {[30, 50, 45, 70, 55].map((h, i) => (
                                            <div key={i} className="flex-1 bg-accent/40 rounded-sm" style={{ height: `${h}px` }}></div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Card 1: Top Layer (Link Preview) */}
                                <motion.div
                                    whileHover={{ scale: 1.05, rotateY: -5, rotateX: 2, translateZ: 100 }}
                                    animate={{
                                        y: [0, -20, 0],
                                        rotateX: [2, 6, 2],
                                        rotateY: [-15, -8, -15]
                                    }}
                                    transition={{
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        scale: { duration: 0.2 }
                                    }}
                                    className="relative bg-gradient-to-br from-accent/20 to-black/80 border border-accent/30 p-6 rounded-2xl w-72 backdrop-blur-2xl shadow-glow-purple z-20 cursor-pointer"
                                    style={{
                                        rotateY: '-15deg',
                                        rotateX: '5deg',
                                        transformStyle: 'preserve-3d',
                                        translateZ: '80px'
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                            <Link2 size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-white font-bold tracking-tight">link.ly/offer</div>
                                            <div className="text-[10px] text-secondary">Summer Promo 2026</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
                                        <div className="h-1.5 w-2/3 bg-white/5 rounded-full"></div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Active</div>
                                        <div className="px-2 py-1 bg-accent/20 rounded text-[9px] text-accent-light border border-accent/20">Custom UUID</div>
                                    </div>
                                </motion.div>
                            </motion.div>
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
