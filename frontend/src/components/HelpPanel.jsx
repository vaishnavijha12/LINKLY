import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Code, Activity, Shield, FileText, ExternalLink, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const HelpPanel = ({ isOpen, onClose, activePage }) => {
    // Sync local state for Status page
    const [lastChecked, setLastChecked] = useState(new Date());

    useEffect(() => {
        if (activePage === 'status') {
            const interval = setInterval(() => {
                setLastChecked(new Date());
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [activePage]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const renderContent = () => {
        switch (activePage) {
            case 'docs':
                return (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">What is Linkly?</h2>
                            <p className="text-secondary leading-relaxed text-sm">
                                Linkly is a professional URL shortening service that helps you create clean, trackable links.
                                Transform long URLs into short, memorable links that are easy to share and manage.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">How to Shorten a Link</h2>
                            <ol className="list-decimal list-inside space-y-3 text-secondary text-sm">
                                <li>Paste your long URL into the input field</li>
                                <li>Optionally add a tag to organize your links</li>
                                <li>Click the arrow button or press Enter</li>
                                <li>Your shortened link is ready! Copy it and share anywhere</li>
                            </ol>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Custom Aliases</h2>
                            <p className="text-secondary leading-relaxed mb-3 text-sm">
                                Want a branded link instead of a random code? Create a custom alias to make your links memorable.
                            </p>
                            <div className="bg-black/40 border border-glass-border p-3 rounded-xl text-xs font-mono text-accent">
                                link.ly/offer
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Advanced Features</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2">Tags & Organization</h3>
                                    <p className="text-secondary text-sm">Group your links with tags for easy filtering and management in your dashboard.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2">QR Code Generator</h3>
                                    <p className="text-secondary text-sm">Generate high-quality QR codes for any link with optional logo embedding.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2">Click Analytics</h3>
                                    <p className="text-secondary text-sm">Track clicks, referrers, and geographic data for all your shortened links.</p>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Troubleshooting</h2>
                            <div className="space-y-3">
                                <div className="bg-black/20 border border-glass-border rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-white mb-2">Link not working?</h3>
                                    <p className="text-secondary text-xs">Ensure the original URL is valid and accessible. Check for typos or expired domains.</p>
                                </div>
                                <div className="bg-black/20 border border-glass-border rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-white mb-2">Custom alias already taken?</h3>
                                    <p className="text-secondary text-xs">Try a different alias or add numbers/hyphens to make it unique.</p>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">Are shortened links permanent?</h3>
                                    <p className="text-secondary text-xs">Yes, links remain active unless you delete them from your dashboard.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">Can I edit a shortened link?</h3>
                                    <p className="text-secondary text-xs">You can update tags and metadata, but the short URL itself cannot be changed once created.</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">Is there a link limit?</h3>
                                    <p className="text-secondary text-xs">Free accounts can create unlimited links with basic analytics.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'api':
                return (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
                            <p className="text-secondary leading-relaxed mb-4 text-sm">
                                All API requests require authentication using a Bearer token. Get your API token from your dashboard settings.
                            </p>
                            <pre className="bg-black/60 border border-glass-border rounded-xl p-4 overflow-x-auto">
                                <code className="text-accent-light text-xs">
                                    {`Authorization: Bearer YOUR_API_TOKEN`}
                                </code>
                            </pre>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Create Short URL</h2>
                            <div className="bg-black/40 border border-glass-border rounded-lg p-3 mb-4">
                                <p className="text-accent font-mono text-xs">POST /api/create</p>
                            </div>
                            <p className="text-secondary text-sm mb-3">Create a new shortened URL with optional custom alias and tags.</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-white font-bold mb-2">Request Body:</p>
                                    <pre className="bg-black/60 border border-glass-border rounded-xl p-4 overflow-x-auto">
                                        <code className="text-accent-light text-xs">
                                            {`{
  "originalUrl": "https://example.com/very-long-url",
  "customAlias": "summer-sale",
  "tags": ["marketing", "campaign"]
}`}
                                        </code>
                                    </pre>
                                </div>
                                <div>
                                    <p className="text-xs text-white font-bold mb-2">Response (200):</p>
                                    <pre className="bg-black/60 border border-glass-border rounded-xl p-4 overflow-x-auto">
                                        <code className="text-accent-light text-xs">
                                            {`{
  "success": true,
  "shortUrl": "link.ly/summer-sale",
  "id": "abc123"
}`}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Get URL Statistics</h2>
                            <div className="bg-black/40 border border-glass-border rounded-lg p-3 mb-4">
                                <p className="text-accent font-mono text-xs">GET /api/stats/:id</p>
                            </div>
                            <p className="text-secondary text-sm mb-3">Retrieve click analytics and metadata for a specific shortened URL.</p>
                            <div>
                                <p className="text-xs text-white font-bold mb-2">Response (200):</p>
                                <pre className="bg-black/60 border border-glass-border rounded-xl p-4 overflow-x-auto">
                                    <code className="text-accent-light text-xs">
                                        {`{
  "id": "abc123",
  "shortUrl": "link.ly/summer-sale",
  "originalUrl": "https://example.com/...",
  "clicks": 1247,
  "createdAt": "2024-01-15T10:30:00Z",
  "tags": ["marketing"]
}`}
                                    </code>
                                </pre>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Get All URLs</h2>
                            <div className="bg-black/40 border border-glass-border rounded-lg p-3 mb-4">
                                <p className="text-accent font-mono text-xs">GET /api/urls?tag=marketing&limit=10</p>
                            </div>
                            <p className="text-secondary text-sm mb-3">List all your shortened URLs with optional filtering by tag.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Update URL</h2>
                            <div className="bg-black/40 border border-glass-border rounded-lg p-3 mb-4">
                                <p className="text-accent font-mono text-xs">PATCH /api/update/:id</p>
                            </div>
                            <p className="text-secondary text-sm mb-3">Update tags or metadata for an existing shortened URL.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Delete URL</h2>
                            <div className="bg-black/40 border border-glass-border rounded-lg p-3 mb-4">
                                <p className="text-accent font-mono text-xs">DELETE /api/delete/:id</p>
                            </div>
                            <p className="text-secondary text-sm mb-3">Permanently delete a shortened URL. This action cannot be undone.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Error Codes</h2>
                            <div className="space-y-2">
                                <div className="bg-black/20 border border-glass-border rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-white text-sm font-mono">400</span>
                                    <span className="text-secondary text-xs">Bad Request - Invalid parameters</span>
                                </div>
                                <div className="bg-black/20 border border-glass-border rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-white text-sm font-mono">401</span>
                                    <span className="text-secondary text-xs">Unauthorized - Invalid API token</span>
                                </div>
                                <div className="bg-black/20 border border-glass-border rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-white text-sm font-mono">404</span>
                                    <span className="text-secondary text-xs">Not Found - URL does not exist</span>
                                </div>
                                <div className="bg-black/20 border border-glass-border rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-white text-sm font-mono">409</span>
                                    <span className="text-secondary text-xs">Conflict - Alias already taken</span>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'status':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-glass-border">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Operational</h2>
                                <p className="text-xs text-secondary">
                                    Last checked: {lastChecked.toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-lg px-3 py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                                <span className="text-accent text-xs font-medium">Live</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {['Shortening', 'Redirects', 'QR Gen', 'Database', 'API'].map((s) => (
                                <div key={s} className="flex items-center justify-between p-3 bg-black/20 border border-glass-border rounded-xl">
                                    <span className="text-white text-sm font-medium">{s}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                        <span className="text-accent text-xs font-medium">Operational</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Data Collection</h2>
                            <p className="text-secondary leading-relaxed text-sm mb-3">
                                We collect minimal data required to provide our service, primarily focused on URLs and click analytics.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-black/20 border border-glass-border rounded-lg p-3">
                                    <h3 className="text-sm font-bold text-white mb-1">Information We Collect:</h3>
                                    <ul className="text-xs text-secondary space-y-1 list-disc list-inside">
                                        <li>Original and shortened URLs</li>
                                        <li>Click analytics (timestamps, referrers, geographic location)</li>
                                        <li>Account information (email, username)</li>
                                        <li>Browser and device information</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">How We Use Your Data</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                Your data is used solely to provide and improve our URL shortening service, including analytics, security, and customer support.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Data Retention</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                We retain your data for as long as your account is active. You can delete your links and account at any time from your dashboard.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Third-Party Services</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                We do not sell your data to third parties. We may use analytics services to improve our platform performance.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Your Rights (GDPR)</h2>
                            <p className="text-secondary text-sm leading-relaxed mb-2">
                                You have the right to access, correct, or delete your personal data at any time.
                            </p>
                            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                                <p className="text-accent text-xs font-medium">EU users have additional rights under GDPR including data portability and the right to be forgotten.</p>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                            <p className="text-secondary text-sm">For privacy inquiries: <span className="text-accent">privacy@linkly.com</span></p>
                        </section>
                    </div>
                );
            case 'terms':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Acceptance of Terms</h2>
                            <p className="text-secondary leading-relaxed text-sm">
                                By accessing and using Linkly, you accept and agree to be bound by these Terms of Service.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Acceptable Use Policy</h2>
                            <p className="text-secondary text-sm mb-3">
                                You agree not to use Linkly for any illegal, harmful, or abusive purposes.
                            </p>
                            <div className="bg-black/20 border border-glass-border rounded-lg p-3">
                                <h3 className="text-sm font-bold text-white mb-2">Prohibited Activities:</h3>
                                <ul className="text-xs text-secondary space-y-1 list-disc list-inside">
                                    <li>Distributing malware, viruses, or harmful software</li>
                                    <li>Phishing, fraud, or deceptive practices</li>
                                    <li>Spam or unsolicited commercial messages</li>
                                    <li>Violating intellectual property rights</li>
                                    <li>Harassment or hate speech</li>
                                </ul>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Service Availability</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to modify or discontinue features with notice.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Account Termination</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Limitation of Liability</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                Linkly is provided "as is" without warranties. We are not liable for any damages arising from the use of our service.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Intellectual Property</h2>
                            <p className="text-secondary text-sm leading-relaxed">
                                All content, trademarks, and intellectual property on Linkly remain the property of their respective owners.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Report Abuse</h2>
                            <p className="text-secondary text-sm">To report violations or abuse: <span className="text-accent">abuse@linkly.com</span></p>
                        </section>
                    </div>
                );
            default:
                return null;
        }
    };

    const getHeaderInfo = () => {
        switch (activePage) {
            case 'docs': return { title: 'Documentation', icon: BookOpen };
            case 'api': return { title: 'API Reference', icon: Code };
            case 'status': return { title: 'System Status', icon: Activity };
            case 'privacy': return { title: 'Privacy Policy', icon: Shield };
            case 'terms': return { title: 'Terms of Service', icon: FileText };
            default: return { title: 'Help Center', icon: BookOpen };
        }
    };

    const header = getHeaderInfo();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[480px] bg-[#0A0A0A] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-glass-bg backdrop-blur-md">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl text-accent ring-1 ring-accent/20">
                                    <header.icon size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{header.title}</h1>
                                    <p className="text-[10px] sm:text-xs text-secondary font-medium opacity-60">Linkly Help Center</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-tertiary hover:text-white hover:bg-white/5 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                            <div className="max-w-none">
                                {renderContent()}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 sm:p-6 border-t border-white/5 text-center bg-black/40">
                            <p className="text-[9px] sm:text-[10px] text-tertiary uppercase tracking-widest font-black opacity-60">
                                Need more help? Support@linkly.com
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HelpPanel;
