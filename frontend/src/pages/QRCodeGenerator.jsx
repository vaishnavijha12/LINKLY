import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Link as LinkIcon, RefreshCw, QrCode, Upload } from "lucide-react";
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
        const canvas = document.getElementById("qr-canvas");
        if (!canvas) return;

        // Create a temporary canvas to draw the composite image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext("2d");

        // Draw the QR code
        ctx.drawImage(canvas, 0, 0);

        // If logo is present, draw it on top
        if (showLogo && logoImg) {
            await new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = logoImg;
                img.onload = () => {
                    const logoSize = canvas.width * 0.22;
                    const logoX = (canvas.width - logoSize) / 2;
                    const logoY = (canvas.height - logoSize) / 2;

                    ctx.beginPath();
                    const radius = logoSize / 2;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;

                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                    ctx.fill();

                    ctx.lineWidth = canvas.width * 0.004;
                    ctx.strokeStyle = "#f3f4f6";
                    ctx.stroke();

                    const padding = logoSize * 0.15;
                    const innerSize = logoSize - (padding * 2);
                    const innerX = logoX + padding;
                    const innerY = logoY + padding;

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, innerSize / 2, 0, 2 * Math.PI, false);
                    ctx.clip();

                    ctx.drawImage(img, innerX, innerY, innerSize, innerSize);
                    ctx.restore();

                    resolve();
                };
                img.onerror = () => {
                    console.error("Failed to load logo for download");
                    resolve();
                };
            });
        }

        let downloadUrl;
        if (extension === 'png') {
            downloadUrl = tempCanvas.toDataURL("image/png");
        } else {
            downloadUrl = tempCanvas.toDataURL("image/png");
        }

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `linkly-qr.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded as ${extension.toUpperCase()}`);
    };

    return (
        <div className="relative z-10 pt-20 pb-10 px-6 flex flex-col items-center min-h-[calc(100vh-80px)] justify-center">

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

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.06] backdrop-blur-glass border border-white/40 p-8 rounded-[32px] shadow-glass relative overflow-hidden group min-h-[460px] flex flex-col justify-center ring-2 ring-accent/20"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-accent/20 transition-colors duration-500"></div>

                    <div className="space-y-8 relative z-10 w-full max-w-sm mx-auto">
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold text-white uppercase tracking-[0.2em] ml-1">Target URL</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-accent transition-colors">
                                    <LinkIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Paste your link here..."
                                    required
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-base"
                                />
                            </div>
                        </div>

                        {/* Logo Toggle Section */}
                        <div className="p-6 bg-white/[0.03] border border-white/20 rounded-[24px] space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">Add Logo in Center</span>
                                    {logoImg && showLogo && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                        />
                                    )}
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={showLogo}
                                        onChange={(e) => setShowLogo(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-accent shadow-inner"></div>
                                </label>
                            </div>

                            <AnimatePresence>
                                {showLogo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-2xl hover:border-accent/40 transition-colors bg-black/20 group">
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                            />
                                            <label
                                                htmlFor="logo-upload"
                                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                                            >
                                                {logoImg ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={logoImg}
                                                            alt="Logo preview"
                                                            className="w-20 h-20 object-contain rounded-lg bg-white/5 p-1"
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                            <span className="text-xs text-white uppercase font-bold tracking-widest">Change</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="p-4 bg-white/5 rounded-full text-secondary mb-2">
                                                            <Upload size={24} />
                                                        </div>
                                                        <span className="text-sm text-secondary font-medium">Click to upload logo</span>
                                                        <span className="text-xs text-tertiary">PNG, JPG, SVG (Max 2MB)</span>
                                                    </>
                                                )}
                                            </label>
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
                                    <span>{qrValue ? "Regenerate QR" : "Generate QR"}</span>
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
                    className="flex flex-col items-start justify-start w-full max-w-[460px] mx-auto lg:mr-auto lg:ml-0"
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
                                <div className="bg-white p-7 rounded-[40px] shadow-[0_0_120px_-10px_rgba(168,85,247,0.4)] mx-auto max-w-[340px] w-full aspect-square flex items-center justify-center mb-8 relative group border-4 border-accent/30 ring-2 ring-accent/20">
                                    <div className="relative">
                                        <QRCodeCanvas
                                            id="qr-canvas"
                                            value={qrValue}
                                            size={260}
                                            level={"H"}
                                            includeMargin={false}
                                        />
                                        {showLogo && logoImg && (
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white rounded-full p-1.5 flex items-center justify-center overflow-hidden shadow-xl border border-gray-100">
                                                <img
                                                    src={logoImg}
                                                    alt="QR Logo"
                                                    className="w-full h-full object-contain rounded-full"
                                                    crossOrigin="anonymous"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 text-center mb-10 overflow-hidden text-ellipsis whitespace-nowrap max-w-full px-4">
                                    <p className="text-tertiary text-sm font-light">Encoded Link</p>
                                    <p className="text-white text-base font-medium">{qrValue}</p>
                                </div>

                                <div className="w-full max-w-[380px] mx-auto space-y-3">
                                    <button
                                        onClick={() => downloadQR('png')}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl transition-all font-bold uppercase tracking-widest hover:bg-zinc-200 active:scale-95 shadow-lg"
                                    >
                                        <Download size={18} />
                                        <span>Download PNG</span>
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3.5 rounded-xl transition-all font-bold uppercase tracking-[0.05em] text-[10px] hover:bg-white/10 active:scale-95"
                                        >
                                            <RefreshCw size={14} className="rotate-45" />
                                            <span>Copy Link</span>
                                        </button>
                                        <button
                                            onClick={openLink}
                                            className="flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white py-3.5 rounded-xl transition-all font-bold uppercase tracking-[0.05em] text-[10px] hover:bg-white/20 active:scale-95"
                                        >
                                            <LinkIcon size={14} />
                                            <span>Open Link</span>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => { setQrValue(""); setUrl(""); setLogoImg(null); setShowLogo(false); }}
                                        className="w-full text-secondary/50 hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors pt-4 h-10 group"
                                    >
                                        <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                        Reset Form
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full">
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Preview</p>
                                <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/10 rounded-[24px] transition-all hover:bg-white/[0.03]">
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
