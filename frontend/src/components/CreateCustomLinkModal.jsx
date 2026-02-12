import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BACKEND_URL } from '../utils/api';
import { toast } from 'react-hot-toast';

const CreateCustomLinkModal = ({ isOpen, onClose, onSuccess }) => {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [tag, setTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [createdLink, setCreatedLink] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setCreatedLink(null);
        setUrl('');
        setAlias('');
        setTag('');
        setCopied(false);
        onClose();
    };

    const handleReset = () => {
        setCreatedLink(null);
        setUrl('');
        setAlias('');
        setTag('');
        setCopied(false);
    };

    const handleCopy = () => {
        const fullUrl = `${BACKEND_URL}/${createdLink}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!url) return;
        if (!alias) {
            toast.error("Alias is required for custom links");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to create custom links");
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.post("/create", {
                originalUrl: url,
                customAlias: alias,
                tags: tag ? [tag] : []
            });
            toast.success("Custom Link Created!");
            setCreatedLink(data.shortUrl);
            if (onSuccess) onSuccess(data.shortUrl);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to create link");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-lg glass-modal overflow-hidden ring-1 ring-glass-border"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-70"></div>

                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white tracking-tight">
                                        {createdLink ? "Link Created!" : "Create Custom Link"}
                                    </h2>
                                    <p className="text-secondary text-sm mt-2">
                                        {createdLink ? "Your custom link is ready to use." : "Branded, memorable links with control."}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 -mr-2 -mt-2 hover:bg-white/10 rounded-full transition-colors text-secondary hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {createdLink ? (
                                <div className="space-y-6">
                                    {/* Success Result */}
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">Your Custom Link</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-black/40 border border-glass-border rounded-lg px-4 py-3">
                                                <p className="text-white font-mono text-sm truncate">
                                                    {BACKEND_URL}/{createdLink}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className="p-3 bg-accent hover:bg-accent-dark rounded-lg transition-colors flex-shrink-0"
                                            >
                                                {copied ? <Check size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="flex-1 bg-white/5 border border-white/10 text-white font-semibold py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex justify-center items-center gap-2"
                                        >
                                            <RefreshCw size={18} />
                                            Create Another
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            className="flex-1 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold py-3.5 rounded-xl hover:shadow-glow-purple transition-all duration-200"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-secondary font-semibold mb-3">Destination URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://example.com/my-long-url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-black/40 border border-glass-border rounded-xl px-5 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all shadow-inner"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-secondary font-semibold mb-3">Custom Alias <span className="text-accent">*</span></label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary text-sm font-mono group-focus-within:text-secondary transition-colors">/</span>
                                                <input
                                                    type="text"
                                                    placeholder="my-brand"
                                                    value={alias}
                                                    onChange={(e) => setAlias(e.target.value)}
                                                    className="w-full bg-black/40 border border-glass-border rounded-xl pl-8 pr-4 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all shadow-inner font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-secondary font-semibold mb-3">Tag (Optional)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Marketing"
                                                    value={tag}
                                                    onChange={(e) => setTag(e.target.value)}
                                                    className="w-full bg-black/40 border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder:text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-glow-purple-sm transition-all shadow-inner text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-4 w-full bg-gradient-to-r from-accent to-accent-dark text-white font-semibold py-4 rounded-xl hover:shadow-glow-purple transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Custom Link"}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CreateCustomLinkModal;
