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
        <div className="relative z-10 pt-[70px] pb-20 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-6xl mx-auto bg-glass-bg backdrop-blur-glass-lg border border-glass-border rounded-[28px] shadow-glass p-6 sm:p-8 md:p-12 overflow-hidden"
            >
                {/* Header */}
                <div className="mb-10 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                            <Filter size={20} className="text-accent sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tags</h1>
                            <p className="text-secondary text-[11px] sm:text-sm">Organize and discover your links</p>
                        </div>
                    </motion.div>
                </div>

                {/* Tags Overview (Cloud) */}
                <section className="mb-12 sm:mb-16">
                    <h2 className="text-[10px] uppercase tracking-wider text-secondary font-bold mb-4 sm:mb-6 flex items-center gap-2">
                        <Hash size={10} /> Active Categories
                    </h2>

                    {sortedTags.length === 0 ? (
                        <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-glass-border">
                            <p className="text-secondary text-sm mb-4">You haven't created any tags yet.</p>
                            <a href="/" className="text-white text-xs font-bold hover:underline flex items-center justify-center gap-2 uppercase tracking-widest">
                                Create a link with tags <ArrowRight size={14} />
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {sortedTags.map(([tagName, count]) => (
                                <motion.button
                                    key={tagName}
                                    onClick={() => setSelectedTag(selectedTag === tagName ? null : tagName)}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 flex items-center gap-2.5 sm:gap-3 ${selectedTag === tagName
                                        ? 'bg-gradient-to-r from-accent to-accent-dark text-white border-accent shadow-glow-purple-sm'
                                        : 'bg-black/40 text-secondary border-glass-border hover:border-accent/30 hover:text-accent-light'
                                        }`}
                                >
                                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">{tagName}</span>
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${selectedTag === tagName
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-6 border-t border-glass-border">
                                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                    <span className="text-secondary font-medium">Results in</span>
                                    <span className="text-accent-light px-2 py-0.5 bg-accent/10 rounded-lg">{selectedTag}</span>
                                </h2>
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-black/40 px-3 py-1.5 rounded-lg border border-glass-border self-start sm:self-auto">
                                    {filteredUrls.length} {filteredUrls.length === 1 ? 'Link' : 'Links'} found
                                </span>
                            </div>

                            <div className="grid gap-3 sm:gap-4">
                                {filteredUrls.map((url) => (
                                    <motion.div
                                        key={url._id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="group bg-black/20 border border-glass-border rounded-2xl p-4 sm:p-5 hover:border-accent/30 transition-all duration-300 hover:bg-black/40 shadow-xl"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="overflow-hidden space-y-1.5">
                                                <a
                                                    href={`${BACKEND_URL}/${url.shortUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-base sm:text-lg font-bold text-white hover:text-accent-light transition-colors flex items-center gap-2 group/link"
                                                >
                                                    /{url.shortUrl}
                                                    <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-secondary" />
                                                </a>
                                                <p className="text-[10px] sm:text-xs text-secondary truncate max-w-full sm:max-w-md font-mono flex items-center gap-2 opacity-60">
                                                    <LinkIcon size={10} className="shrink-0" />
                                                    {url.originalUrl}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                                <button
                                                    onClick={() => copyToClipboard(url.shortUrl)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    <Copy size={14} />
                                                    <span className="sm:hidden">Copy</span>
                                                </button>
                                                <a
                                                    href={`${BACKEND_URL}/${url.shortUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sm:flex-none p-2 text-secondary hover:text-accent-light transition-colors"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
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
                        className="text-center py-16 sm:py-20 text-secondary"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                            <Tag size={24} />
                        </div>
                        <p className="text-sm font-medium">Select a category above to filter your workspace.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Tags;
