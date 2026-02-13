import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Link as LinkIcon, RefreshCw, QrCode, Upload, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const QRCodeGenerator = () => {
    const [url, setUrl] = useState("");
    const [qrValue, setQrValue] = useState("");
    const [loading, setLoading] = useState(false);

    // Logo states
    const [showLogo, setShowLogo] = useState(false);
    const [logoImg, setLogoImg] = useState(null);

    // Check if input looks like a valid URL or just text
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a PNG, JPG, or SVG file");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogoImg(event.target.result);
            toast.success("Logo uploaded successfully");
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!url) {
            toast.error("Please enter a link first");
            return;
        }

        setLoading(true);
        // Simulate a tiny delay for "processing" feel
        setTimeout(() => {
            setQrValue(url);
            setLoading(false);
            toast.success("QR Code generated successfully!");
        }, 600);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(qrValue);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const openLink = () => {
        if (isValidUrl(qrValue)) {
            window.open(qrValue, "_blank", "noopener,noreferrer");
        } else {
            toast.error("Invalid URL format");
        }
    };

    const downloadQR = async (extension) => {
        const svg = document.getElementById("qr-code");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // High resolution for clear download
        const size = 600;
        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);

            ctx.drawImage(img, 0, 0, size, size);

            // Draw logo if present
            if (showLogo && logoImg) {
                const logo = new Image();
                logo.crossOrigin = "anonymous";
                logo.onload = () => {
                    const logoSize = size * 0.22; // 22% of QR size
                    const x = (size - logoSize) / 2;
                    const y = (size - logoSize) / 2;

                    // White circle background for logo
                    ctx.beginPath();
                    ctx.arc(size / 2, size / 2, logoSize / 2 + 2, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    // Optional: Border
                    ctx.lineWidth = 0;
                    ctx.strokeStyle = '#ffffff';
                    ctx.stroke();

                    // Clip to circle
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(size / 2, size / 2, logoSize / 2, 0, 2 * Math.PI);
                    ctx.clip();
                    ctx.drawImage(logo, x, y, logoSize, logoSize);
                    ctx.restore();

                    triggerDownload();
                };
                logo.onerror = () => {
                    // If logo fails, still download QR
                    triggerDownload();
                };
                logo.src = logoImg;
            } else {
                triggerDownload();
            }
        };

        const triggerDownload = () => {
            if (extension === 'png') {
                try {
                    const downloadUrl = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = `linkly-qr.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success(`Downloaded as PNG`);
                } catch (e) {
                    console.error(e);
                    toast.error("Failed to download");
                }
            }
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="relative z-10 pt-20 pb-10 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-80px)] justify-center">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 max-w-2xl mx-auto"
            >
                <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-xl mb-4 border border-white/10 shadow-glow-purple-sm">
                    <QrCode size={24} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight uppercase">
                    QR Code Generator
                </h1>
                <p className="text-secondary max-w-md mx-auto font-light text-sm leading-relaxed">
                    Turn any link into a scannable QR code. Fast, private, and free.
                </p>
            </motion.div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-start justify-start w-full max-w-md mx-auto lg:mr-auto lg:ml-0 space-y-8"
                >
                    <div className="w-full space-y-6 bg-glass-bg backdrop-blur-glass p-8 rounded-[32px] border border-glass-border">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-tertiary ml-1">Destination URL</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
                                />
                                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent transition-colors" />
                            </div>
                        </div>

                        {/* Logo Upload Toggle Section */}
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-white">Add Logo in Center</span>
                                <button
                                    onClick={() => setShowLogo(!showLogo)}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${showLogo ? 'bg-accent' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showLogo ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {showLogo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="relative group border-2 border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-6 transition-all bg-black/20">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex flex-col items-center justify-center text-center space-y-2">
                                                {logoImg ? (
                                                    <div className="relative">
                                                        <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain rounded-lg mb-2" />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setLogoImg(null); }}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload size={24} className="text-tertiary group-hover:text-accent transition-colors" />
                                                        <p className="text-xs text-secondary font-medium">Upload png, jpg or svg</p>
                                                        <p className="text-[10px] text-zinc-600">Max size: 2MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !url}
                            className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-bold uppercase tracking-widest text-base
                                ${!url ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:bg-zinc-200 shadow-glow-white-sm transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95'}`}
                        >
                            {loading ? (
                                <span className="animate-pulse">Generating...</span>
                            ) : (
                                <>
                                    <span>{qrValue ? "Regenerate" : "Generate"}</span>
                                    {qrValue ? <RefreshCw size={18} /> : <QrCode size={18} />}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-start w-full max-w-[460px] mx-auto lg:mr-auto lg:ml-0"
                >
                    <AnimatePresence mode="wait">
                        {qrValue ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full"
                            >
                                <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-2xl mx-auto max-w-[340px] w-full aspect-square flex items-center justify-center mb-8 relative group border-2 border-accent/20">
                                    <div className="relative flex items-center justify-center">
                                        <QRCodeSVG
                                            id="qr-code"
                                            value={qrValue}
                                            size={260}
                                            level={"H"}
                                            includeMargin={false}
                                        />
                                        {showLogo && logoImg && (
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-white rounded-full p-1 flex items-center justify-center overflow-hidden shadow-xl border border-gray-100 z-10">
                                                <img
                                                    src={logoImg}
                                                    alt="QR Logo"
                                                    className="w-full h-full object-contain rounded-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                    <button
                                        onClick={() => downloadQR('png')}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl transition-all font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 active:scale-95 shadow-lg"
                                    >
                                        <Download size={18} /> PNG
                                    </button>
                                    <button
                                        onClick={openLink}
                                        className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white py-4 rounded-xl transition-all font-bold uppercase tracking-widest text-xs hover:bg-white/20 active:scale-95"
                                    >
                                        <ExternalLink size={18} /> Visit
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full">
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Preview</p>
                                <div className="w-full min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/10 rounded-[24px] transition-all">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/30">
                                        <QrCode size={32} />
                                    </div>
                                    <p className="text-white/40 text-sm font-medium">QR code will appear here</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
