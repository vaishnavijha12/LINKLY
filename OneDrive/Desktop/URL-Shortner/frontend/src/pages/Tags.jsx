import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Hash, Link as LinkIcon, Calendar, ArrowRight, Copy, ExternalLink, Filter } from 'lucide-react';
import api, { BACKEND_URL } from '../utils/api';
import { toast } from 'react-hot-toast';

const Tags = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const { data } = await api.get("/create/my-urls");
                setUrls(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load tags");
            } finally {
                setLoading(false);
            }
        };
        fetchUrls();
    }, []);

    // Compute Tags and Counts
    const tagStats = urls.reduce((acc, url) => {
        if (url.tags && url.tags.length > 0) {
            url.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
        }
        return acc;
    }, {});

    const sortedTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]); // Sort by count desc

    const filteredUrls = selectedTag
        ? urls.filter(url => url.tags?.includes(selectedTag))
        : [];

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(`${BACKEND_URL}/${shortUrl}`);
        toast.success("Copied!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-zinc-200 animate-spin mb-4"></div>
                    <span className="text-sm font-medium">Syncing Tags...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 pt-[70px] pb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-6xl mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass p-8 md:p-12 overflow-hidden"
            >
                {/* Header */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <Filter size={24} className="text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tags & Filters</h1>
                            <p className="text-secondary text-sm">Organize and access your links by category</p>
                        </div>
                    </motion.div>
                </div>

                {/* Tags Overview (Cloud) */}
                <section className="mb-16">
                    <h2 className="text-xs uppercase tracking-wider text-secondary font-semibold mb-6 flex items-center gap-2">
                        <Hash size={12} /> Available Tags
                    </h2>

                    {sortedTags.length === 0 ? (
                        <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-glass-border">
                            <p className="text-secondary mb-4">You haven't created any tags yet.</p>
                            <a href="/" className="text-white text-sm font-medium hover:underline flex items-center justify-center gap-2">
                                Create a link with tags <ArrowRight size={14} />
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {sortedTags.map(([tagName, count]) => (
                                <motion.button
                                    key={tagName}
                                    onClick={() => setSelectedTag(selectedTag === tagName ? null : tagName)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group relative px-5 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${selectedTag === tagName
                                        ? 'bg-gradient-to-r from-accent to-accent-dark text-white border-accent shadow-glow-purple-sm'
                                        : 'bg-black/40 text-secondary border-glass-border hover:border-accent/30 hover:text-accent-light'
                                        }`}
                                >
                                    <span className="font-medium">{tagName}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${selectedTag === tagName
                                        ? 'bg-black/10 text-white'
                                        : 'bg-white/10 text-secondary group-hover:text-white'
                                        }`}>
                                        {count}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Filtered Links Section */}
                <AnimatePresence mode="wait">
                    {selectedTag && (
                        <motion.section
                            key={selectedTag}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-6 pt-6 border-t border-glass-border">
                                <h2 className="text-xl font-medium text-white flex items-center gap-2">
                                    <span className="text-secondary">Links in</span>
                                    <span className="text-white border-b border-accent/20 pb-0.5">{selectedTag}</span>
                                </h2>
                                <span className="text-xs text-secondary bg-black/40 px-3 py-1 rounded-full border border-glass-border">
                                    {filteredUrls.length} Result{filteredUrls.length !== 1 && 's'}
                                </span>
                            </div>

                            <div className="grid gap-4">
                                {filteredUrls.map((url) => (
                                    <motion.div
                                        key={url._id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="group bg-black/20 border border-glass-border rounded-xl p-5 hover:border-accent/30 transition-all duration-300 hover:bg-black/40"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="overflow-hidden">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <a
                                                        href={`${BACKEND_URL}/${url.shortUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-lg font-mono text-white hover:text-accent-light transition-colors flex items-center gap-2"
                                                    >
                                                        /{url.shortUrl}
                                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                                                    </a>
                                                </div>
                                                <p className="text-sm text-secondary truncate max-w-md font-light flex items-center gap-2">
                                                    <LinkIcon size={12} className="shrink-0" />
                                                    {url.originalUrl}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 self-start sm:self-center">
                                                <button
                                                    onClick={() => copyToClipboard(url.shortUrl)}
                                                    className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Copy Short Link"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {!selectedTag && sortedTags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-secondary"
                    >
                        <p>Select a tag above to view associated links.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Tags;
