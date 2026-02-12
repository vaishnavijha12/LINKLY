import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import api, { BACKEND_URL } from "../utils/api";
import { toast } from "react-hot-toast";
import { ExternalLink, Copy, Clock, MousePointer2, Trash2, Tag, Filter } from "lucide-react";

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("All");
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
    const filteredUrls = selectedTag === "All"
        ? urls
        : urls.filter(url => url.tags?.includes(selectedTag));

    if (loading) return <div className="text-center mt-20 text-white animate-pulse">Syncing...</div>;

    return (
        <div className="relative z-10 pt-[70px] pb-20 px-6">
            <div className="max-w-6xl mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass p-8 md:p-12 overflow-hidden">
                {/* Header section with Stats */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-glass-border pb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Overview</h2>
                            <p className="text-secondary font-light">Your link performance at a glance.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
                                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Total Links</span>
                                <span className="text-3xl font-mono text-white">{urls.length < 10 ? `0${urls.length}` : urls.length}</span>
                            </div>
                            <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] border-accent/20">
                                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Total Clicks</span>
                                <span className="text-3xl font-mono text-white">
                                    {urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tag Filters */}
                    <div ref={tagsSectionRef} className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        <div className="p-2 bg-black/40 rounded-lg border border-glass-border shrink-0">
                            <Filter size={16} className="text-secondary" />
                        </div>
                        {uniqueTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap border ${selectedTag === tag
                                    ? "bg-gradient-to-r from-accent to-accent-dark text-white border-accent shadow-glow-purple-sm scale-105"
                                    : "bg-black/40 text-secondary border-glass-border hover:border-accent/30 hover:text-accent-light"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {urls.length === 0 ? (
                    <div className="text-center py-32 bg-black/20 rounded-3xl border border-dashed border-glass-border">
                        <p className="text-secondary text-lg mb-8 font-light">No active links found. Start by creating one.</p>
                        <a href="/" className="inline-block bg-gradient-to-r from-accent to-accent-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:shadow-glow-purple transition-all duration-200 hover:scale-105">
                            Create Your First Link
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredUrls.map((url) => (
                            <div
                                key={url._id}
                                className="bg-black/20 p-6 rounded-3xl group hover-lift transition-all duration-200 border border-glass-border hover:border-accent/30 hover:shadow-glow-purple-sm relative overflow-hidden"
                            >
                                {/* Accent Glow on Hover */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                <div className="flex flex-col h-full relative z-10">
                                    {/* Top Row: Favicon/Icon + Stats */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-black/40 border border-glass-border flex items-center justify-center text-secondary group-hover:text-accent group-hover:border-accent/30 transition-all duration-200">
                                            <Clock size={20} />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-glass-border group-hover:border-accent/20 transition-all duration-200">
                                            <MousePointer2 size={14} className="text-secondary group-hover:text-accent transition-colors" />
                                            <span className="text-sm font-mono font-medium text-white">{url.clicks}</span>
                                        </div>
                                    </div>

                                    {/* Link Content */}
                                    <div className="mb-6 flex-grow">
                                        <h3 className="text-sm text-secondary font-light mb-1 truncate" title={url.originalUrl}>
                                            {url.originalUrl}
                                        </h3>
                                        <a
                                            href={`${BACKEND_URL}/${url.shortUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xl font-bold flex items-center gap-2 hover:text-accent-light transition-colors group/link"
                                        >
                                            <span className="animated-gradient-text italic">/{url.shortUrl}</span>
                                            <ExternalLink size={16} className="opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all text-secondary" />
                                        </a>
                                    </div>

                                    {/* Footer: Tags + Actions */}
                                    <div className="flex items-center justify-between pt-6 border-t border-glass-border">
                                        <div className="flex gap-2">
                                            {url.tags && url.tags.length > 0 ? (
                                                url.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-black/40 px-2 py-1 rounded-md border border-glass-border">
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary">No Tags</span>
                                            )}
                                            {url.tags?.length > 2 && (
                                                <span className="text-[10px] font-bold text-secondary">+{url.tags.length - 2}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => copyToClipboard(url.shortUrl)}
                                                className="p-2.5 text-secondary hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                                title="Copy Link"
                                            >
                                                <Copy size={18} />
                                            </button>
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
