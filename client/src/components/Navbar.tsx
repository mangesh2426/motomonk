'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">Moto Monk</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/services" className="text-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
            <Link href="/contact" className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-orange-600 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground hover:text-primary">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-t border-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/services" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
