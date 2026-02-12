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
                    className="max-w-[1400px] mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass overflow-hidden"
                >
                    {/* Main Split Panel - Tool Card + Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 p-14 items-center min-h-[650px]">
                        {/* LEFT: Tool Card (55%) */}
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-secondary uppercase tracking-widest mb-3 font-semibold">LINKLY</div>
                                <h1 className="text-4xl font-bold tracking-tight mb-3 text-white leading-tight">
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
                                            className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-4 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all text-base pr-14"
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
                                            className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-3 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all text-sm pr-10"
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

                        <div className="hidden md:flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
                                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full max-w-md"
                                style={{ perspective: '1000px' }}
                            >
                                {/* Ambient glow */}
                                <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-[60px] -z-10"></div>

                                {/* Contextual Analytics Preview Card */}
                                <div
                                    className="bg-gradient-to-br from-glass-bg to-black/60 border border-glass-border rounded-2xl p-6 shadow-2xl backdrop-blur-glass"
                                    style={{ transform: 'rotateY(-5deg) rotateX(2deg)' }}
                                >
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">Your Links</h3>
                                                <p className="text-xs text-secondary mt-0.5">Last 24 hours</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                                <div className="w-2 h-2 rounded-full bg-accent/50"></div>
                                                <div className="w-2 h-2 rounded-full bg-accent/30"></div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-black/40 rounded-lg p-3 border border-glass-border">
                                                <div className="text-xs text-secondary mb-1">Link Clicks</div>
                                                <div className="text-2xl font-bold text-white">1,247</div>
                                                <div className="text-xs text-accent">+12.5%</div>
                                            </div>
                                            <div className="bg-black/40 rounded-lg p-3 border border-glass-border">
                                                <div className="text-xs text-secondary mb-1">Created Today</div>
                                                <div className="text-2xl font-bold text-white">8</div>
                                                <div className="text-xs text-accent">+3 new</div>
                                            </div>
                                        </div>

                                        {/* Graph */}
                                        <div className="bg-black/40 rounded-lg p-4 border border-glass-border">
                                            <div className="flex items-end justify-between h-24 gap-2">
                                                {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                                                    <div key={i} className="flex-1 bg-gradient-to-t from-accent to-accent-light rounded-t opacity-80" style={{ height: `${height}%` }}></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Links - Real Examples */}
                                        <div className="space-y-2">
                                            {[
                                                { url: 'link.ly/offer', clicks: 127 },
                                                { url: 'link.ly/resume', clicks: 89 },
                                                { url: 'link.ly/github', clicks: 64 }
                                            ].map((link, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-black/20 rounded-lg p-2.5 border border-glass-border/50">
                                                    <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
                                                        <Link2 size={14} className="text-accent" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs text-white font-medium truncate">{link.url}</div>
                                                        <div className="text-[10px] text-secondary">{link.clicks} clicks</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Continue with existing sections below */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* SECTION 2: CONTEXT */}
                <section className="py-40 flex flex-col items-center text-center">
                    <h2 className="text-section md:text-section-lg font-semibold mb-6 text-white">
                        This is more than a short link.
                    </h2>
                    <p className="text-xl text-secondary max-w-2xl leading-relaxed">
                        Organize, customize, and manage everything in one place.
                        Turn your links into powerful tools for your workflow.
                    </p>
                </section>

                {/* SECTION 3: EXPLORE FEATURES */}
                <section className="py-40">
                    <div className="mb-20">
                        <h2 className="text-section md:text-section-lg font-semibold text-white">
                            Explore Features
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))}
                    </div>
                </section>

                {/* SECTION 4: QUICK ACCESS / FLOW */}
                <section className="py-40 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-medium text-white mb-10">Pick a tool to continue.</h3>
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
