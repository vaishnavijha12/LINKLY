import { Link2, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ onOpenHelp }) => {
    return (
        <footer className="bg-background border-t border-divider pt-24 pb-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-3 mb-6 group">
                            <div className="bg-gradient-to-br from-accent to-accent-dark text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-glow-purple-sm">
                                <Link2 size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight animated-gradient-text">Linkly</span>
                        </Link>
                        <p className="text-secondary text-sm font-light leading-relaxed mb-6">
                            Simplifying your digital presence with professional URL shortening and management tools.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2.5 bg-glass-bg rounded-xl border border-glass-border text-secondary hover:text-accent-light hover:border-accent/30 hover:shadow-glow-purple-sm transition-all duration-200">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2.5 bg-glass-bg rounded-xl border border-glass-border text-secondary hover:text-accent-light hover:border-accent/30 hover:shadow-glow-purple-sm transition-all duration-200">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2.5 bg-glass-bg rounded-xl border border-glass-border text-secondary hover:text-accent-light hover:border-accent/30 hover:shadow-glow-purple-sm transition-all duration-200">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px]">URL Shortener</Link></li>
                            <li><Link to="/qr" className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px]">QR Codes</Link></li>
                            <li><Link to="/dashboard" className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px]">Analytics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => onOpenHelp('docs')} className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px] text-left">Documentation</button></li>
                            <li><button onClick={() => onOpenHelp('api')} className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px] text-left">API Reference</button></li>
                            <li><button onClick={() => onOpenHelp('status')} className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px] text-left">Status</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => onOpenHelp('privacy')} className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px] text-left">Privacy Policy</button></li>
                            <li><button onClick={() => onOpenHelp('terms')} className="text-secondary hover:text-accent-light text-sm transition-colors duration-200 uppercase tracking-widest font-bold text-[9px] text-left">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-divider flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-tertiary text-xs font-light flex items-center gap-1.5">
                        © 2026 Linkly. Built with <Heart size={10} className="text-accent/60" /> for the web.
                    </p>
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow-purple-sm"></div>
                            <span className="text-secondary text-[8px] uppercase tracking-wider font-medium">Systems Operational</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
