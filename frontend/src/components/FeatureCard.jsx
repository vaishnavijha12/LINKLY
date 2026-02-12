import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon: Icon, link, onClick, index = 0 }) => {
    const cardContent = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="group/card glass-panel p-6 rounded-3xl hover:border-accent/30 hover:shadow-glow-purple transition-all duration-200 h-full flex flex-col justify-between cursor-pointer relative overflow-hidden"
        >
            <div className="relative z-10">
                {/* Icon with circular gradient background */}
                <div className="mb-6 w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent-dark/20 flex items-center justify-center group-hover/card:shadow-glow-purple-sm transition-all duration-200">
                    <Icon size={24} strokeWidth={1.5} className="text-accent-light group-hover/card:text-accent transition-colors duration-200" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4 group-hover/card:text-accent-light transition-colors duration-200">{title}</h3>
                <p className="text-secondary text-base leading-relaxed group-hover/card:text-white/80 transition-colors duration-200">{description}</p>
            </div>

            {/* Subtle Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </motion.div>
    );

    if (onClick) {
        return (
            <div onClick={onClick} className="block h-full">
                {cardContent}
            </div>
        );
    }

    return (
        <Link to={link || "#"} className="block h-full">
            {cardContent}
        </Link>
    );
};

export default FeatureCard;
