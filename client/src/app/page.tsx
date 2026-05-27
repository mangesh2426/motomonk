'use client';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, PhoneCall, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import SocialProofToast from '@/components/SocialProofToast';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-6 inline-block">
              Next-Gen Lead Generation
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Automate Your Sales with <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Intelligent AI Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Moto Monk empowers your business with 24/7 AI Chatbots, WhatsApp Automation, and AI Voice Calling to capture and convert leads seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center gap-2 w-full sm:w-auto justify-center">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="px-8 py-4 rounded-full bg-card border border-gray-700 text-white font-bold text-lg hover:bg-gray-800 transition-all w-full sm:w-auto justify-center flex">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-card/50 px-4 sm:px-6 lg:px-8 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Supercharge Your Growth</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to automate lead capture and customer support.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Web Chatbot</h3>
              <p className="text-gray-400">Engage website visitors instantly, answer queries, and collect lead information 24/7 without human intervention.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <Zap className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">WhatsApp Automation</h3>
              <p className="text-gray-400">Connect with customers on their favorite app. Automate follow-ups and support queries via WhatsApp Cloud API.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <PhoneCall className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Voice Calling</h3>
              <p className="text-gray-400">Deploy intelligent voice assistants to call and verify leads, complete with speech-to-text summaries.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Don&apos;t let valuable leads slip away. Partner with Moto Monk and let our AI systems work tirelessly to grow your customer base.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="text-primary w-6 h-6" /> Seamless Integration</li>
              <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="text-primary w-6 h-6" /> Customizable AI Persona</li>
              <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="text-primary w-6 h-6" /> Real-time Analytics Dashboard</li>
            </ul>
            <a href="tel:9769745585" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
              <PhoneCall className="w-5 h-5 text-primary" /> Call Us: +91 9769745585
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            <h3 className="text-2xl font-bold mb-6 relative z-10">Request a Demo</h3>
            <ContactForm />
          </motion.div>
        </div>
      </section>
      
      <SocialProofToast />
    </div>
  );
}
