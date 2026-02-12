import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ArrowRight, ExternalLink, Edit2, Save, X, Search, Activity, Power, AlertCircle } from 'lucide-react';
import api, { BACKEND_URL } from '../utils/api';
import { toast } from 'react-hot-toast';

const Redirects = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ originalUrl: '', isActive: true, redirectType: '302' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const { data } = await api.get("/create/my-urls");
            setUrls(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load redirects");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (url) => {
        setEditingId(url._id);
        setEditData({
            originalUrl: url.originalUrl,
            isActive: url.isActive !== undefined ? url.isActive : true,
            redirectType: url.redirectType || '302'
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({ originalUrl: '', isActive: true, redirectType: '302' });
    };

    const handleUpdate = async (id) => {
        if (!editData.originalUrl) return toast.error("Destination URL cannot be empty");

        try {
            const { data } = await api.patch(`/create/${id}`, editData);
            setUrls(urls.map(url => url._id === id ? { ...url, ...data } : url));
            setEditingId(null);
            toast.success("Redirect updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update redirect");
        }
    };

    const filteredUrls = urls.filter(url =>
        url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Syncing Redirects...</div>;

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
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <Shuffle size={24} className="text-accent" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Redirects</h1>
                                <p className="text-secondary text-sm">Manage link destinations without changing the short link.</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-glass-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* List */}
                <div className="grid gap-4">
                    <AnimatePresence>
                        {filteredUrls.map((url) => (
                            <motion.div
                                key={url._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`group border rounded-xl p-5 transition-all duration-300 ${editingId === url._id
                                    ? 'bg-black/60 border-accent/50 ring-1 ring-accent/20'
                                    : 'bg-black/20 border-glass-border hover:border-accent/30'
                                    }`}
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    {/* Link Info */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-lg font-mono text-white">
                                                <span className="text-secondary">/</span>
                                                {url.shortUrl}
                                                <a
                                                    href={`${BACKEND_URL}/${url.shortUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary hover:text-white"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${url.isActive !== false
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}>
                                                    {url.isActive !== false ? 'ACTIVE' : 'PAUSED'}
                                                </span>
                                            </div>
                                        </div>

                                        {editingId === url._id ? (
                                            <div className="w-full animate-in fade-in zoom-in duration-200 space-y-4">
                                                {/* Edit Destination */}
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight size={16} className="text-accent shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={editData.originalUrl}
                                                        onChange={(e) => setEditData({ ...editData, originalUrl: e.target.value })}
                                                        className="w-full bg-black/50 border border-glass-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accent/50 transition-colors font-light"
                                                        autoFocus
                                                        placeholder="https://new-destination.com"
                                                    />
                                                </div>

                                                {/* Edit Settings */}
                                                <div className="flex flex-wrap gap-4 pl-6">
                                                    <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer hover:text-white">
                                                        <input
                                                            type="checkbox"
                                                            checked={editData.isActive}
                                                            onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                                                            className="accent-accent"
                                                        />
                                                        Active Status
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-secondary font-light min-w-0">
                                                <ArrowRight size={14} className="shrink-0 text-secondary" />
                                                <div className="truncate w-full">{url.originalUrl}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 self-start lg:self-center mt-4 lg:mt-0">
                                        {editingId === url._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdate(url._id)}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-4 py-2 rounded-lg hover:shadow-glow-purple-sm transition-all text-sm font-medium"
                                                >
                                                    <Save size={14} /> Update
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(url)}
                                                className="flex items-center gap-2 text-secondary hover:text-white hover:bg-black/40 px-4 py-2 rounded-lg transition-all text-sm border border-glass-border hover:border-accent/30 bg-black/20"
                                            >
                                                <Edit2 size={14} /> Edit Redirect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredUrls.length === 0 && (
                        <div className="text-center py-20 text-secondary border border-dashed border-glass-border rounded-xl">
                            <AlertCircle className="mx-auto mb-3 opacity-50" size={24} />
                            <p>No redirect rules created yet.</p>
                            <p className="text-xs mt-1 text-tertiary">Create a short link to manage redirects.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Redirects;
