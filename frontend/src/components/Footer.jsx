import { Link2, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ onOpenHelp }) => {
    return (
        <footer className="bg-background border-t border-divider pt-16 sm:pt-24 pb-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] sm:h-[400px] bg-accent/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16 md:mb-20">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-3 mb-6 group">
                            <div className="bg-gradient-to-br from-accent to-accent-dark text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-glow-purple-sm">
                                <Link2 size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight animated-gradient-text">Linkly</span>
                        </Link>
                        <p className="text-secondary text-sm font-medium leading-relaxed mb-6 opacity-70 max-w-xs">
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
                    <div className="col-span-1">
                        <h4 className="text-white font-black mb-6 text-[10px] uppercase tracking-[0.2em] opacity-50">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-secondary hover:text-accent-light text-[10px] sm:text-xs transition-colors duration-200 uppercase tracking-widest font-black text-left opacity-80">URL Shortener</Link></li>
                            <li><Link to="/qr" className="text-secondary hover:text-accent-light text-[10px] sm:text-xs transition-colors duration-200 uppercase tracking-widest font-black text-left opacity-80">QR Codes</Link></li>
                            <li><Link to="/dashboard" className="text-secondary hover:text-accent-light text-[10px] sm:text-xs transition-colors duration-200 uppercase tracking-widest font-black text-left opacity-80">Analytics</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-white font-black mb-6 text-[10px] uppercase tracking-[0.2em] opacity-50">Legal</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => onOpenHelp('privacy')} className="text-secondary hover:text-accent-light text-[10px] sm:text-xs transition-colors duration-200 uppercase tracking-widest font-black text-left opacity-80">Privacy Policy</button></li>
                            <li><button onClick={() => onOpenHelp('terms')} className="text-secondary hover:text-accent-light text-[10px] sm:text-xs transition-colors duration-200 uppercase tracking-widest font-black text-left opacity-80">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-divider flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-tertiary text-[10px] sm:text-xs font-medium flex items-center gap-1.5 opacity-60">
                        © 2026 Linkly. Built with <Heart size={10} className="text-accent/60" /> for the web.
                    </p>
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow-purple-sm"></div>
                            <span className="text-secondary text-[9px] uppercase tracking-[0.2em] font-black opacity-60">Systems Operational</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
