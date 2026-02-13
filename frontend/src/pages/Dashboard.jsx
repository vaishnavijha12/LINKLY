import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import api, { BACKEND_URL } from "../utils/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ExternalLink, Copy, Clock, MousePointer2, Trash2, Tag, Filter, Calendar, Search } from "lucide-react";

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const tagsSectionRef = useRef(null);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const { data } = await api.get("/create/my-urls");
                setUrls(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load your URLs");
            } finally {
                setLoading(false);
            }
        };
        fetchUrls();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const action = params.get("action");

        if (action === "tags" && tagsSectionRef.current) {
            setTimeout(() => {
                tagsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                tagsSectionRef.current.classList.add("ring-2", "ring-white", "ring-offset-2", "ring-offset-black");
                setTimeout(() => tagsSectionRef.current.classList.remove("ring-2", "ring-white", "ring-offset-2", "ring-offset-black"), 2000);
            }, 500);
        } else if (action === "redirects") {
            // In a real app, this would open an edit mode. For now, we guide the user.
            toast("Hover over a link to manage its destination or delete it.", {
                icon: 'ℹ️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                duration: 4000
            });
        }
    }, [location, loading]); // Run when location changes or loading finishes (to ensure refs are ready)

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(`${BACKEND_URL}/${shortUrl}`);
        toast.success("Copied to clipboard!");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this link?")) return;

        try {
            await api.delete(`/create/${id}`);
            setUrls(urls.filter((url) => url._id !== id));
            toast.success("Link deleted");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete link");
        }
    };

    // Filter Logic
    const uniqueTags = ["All", ...new Set(urls.flatMap(url => url.tags || []))];
    const filteredUrls = urls.filter(url => {
        const matchesTag = selectedTag && selectedTag !== "All" ? url.tags?.includes(selectedTag) : true;
        const matchesSearch = searchTerm
            ? (url.originalUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                url.shortUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                url.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            : true;
        return matchesTag && matchesSearch;
    });

    // Helper function for date formatting
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <div className="text-center mt-20 text-white animate-pulse">Syncing...</div>;

    return (
        <div className="relative z-10 pt-[70px] pb-20 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-6xl mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass p-6 sm:p-8 md:p-12 overflow-hidden"
            >
                {/* Stats Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 border-b border-glass-border pb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
                        <p className="text-secondary text-sm">Real-time engagement discovery</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full lg:w-auto">
                        <div className="bg-black/20 p-4 rounded-xl border border-glass-border">
                            <p className="text-tertiary text-[10px] uppercase tracking-wider font-bold mb-1">Total Links</p>
                            <p className="text-2xl font-black text-white">{urls.length}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-glass-border">
                            <p className="text-tertiary text-[10px] uppercase tracking-wider font-bold mb-1">Total Clicks</p>
                            <p className="text-2xl font-black text-white">{urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-glass-border col-span-2 md:col-span-1">
                            <p className="text-tertiary text-[10px] uppercase tracking-wider font-bold mb-1">Active Tags</p>
                            <p className="text-2xl font-black text-white">{[...new Set(urls.flatMap(u => u.tags || []))].length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${!selectedTag ? 'bg-accent text-white shadow-glow-purple-sm' : 'bg-white/5 text-secondary hover:text-white border border-white/5'}`}
                        >
                            All Links
                        </button>
                        {[...new Set(urls.flatMap(u => u.tags || []))].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${selectedTag === tag ? 'bg-accent text-white shadow-glow-purple-sm' : 'bg-white/5 text-secondary hover:text-white border border-white/5'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search links..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-glass-border rounded-xl px-10 py-2.5 text-sm text-white placeholder:text-tertiary focus:outline-none focus:border-accent/40"
                        />
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredUrls.length > 0 ? (
                        filteredUrls.map((url) => (
                            <motion.div
                                key={url._id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative bg-[#0d0d11] hover:bg-[#121218] border border-glass-border hover:border-accent/30 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl"
                            >
                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                                <ExternalLink size={18} className="text-accent sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5 truncate pr-2">/{url.shortUrl}</h3>
                                                <p className="text-[10px] sm:text-xs text-secondary font-mono truncate max-w-[140px] sm:max-w-[200px]">{url.originalUrl}</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 px-2.5 py-1 rounded-lg border border-glass-border">
                                            <span className="text-[10px] sm:text-xs font-black text-accent-light">{url.clicks || 0}</span>
                                        </div>
                                    </div>

                                    {url.tags && url.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                                            {url.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-accent/5 border border-accent/10 rounded text-[9px] font-bold text-accent-light uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                                        <p className="text-[9px] sm:text-[10px] font-bold text-tertiary uppercase flex items-center gap-1.5">
                                            <Calendar size={10} />
                                            {formatDate(url.createdAt)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(url.shortUrl)}
                                                className="p-2 text-secondary hover:text-accent-light transition-colors"
                                                title="Copy Link"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <a
                                                href={`${BACKEND_URL}/${url.shortUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-secondary hover:text-accent-light transition-colors"
                                                title="Visit Link"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(url._id)}
                                                className="p-2.5 text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                title="Delete Link"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 sm:py-24 text-center">
                            <p className="text-secondary font-medium mb-6">No links found matching your search.</p>
                            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:shadow-glow-purple-sm transition-all sm:scale-105">
                                Create your first link
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
