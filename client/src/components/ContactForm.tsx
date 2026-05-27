'use client';

import { useState } from 'react';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    interest: '', // Temporary field for step 1
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestSelect = (interest: string) => {
    setFormData({ ...formData, interest, message: `Interest: ${interest}` });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/leads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          source: 'web'
        }),
      });

      if (!response.ok) {
        throw new Error('Lead submission failed');
      }

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        interest: '',
      });
      setStep(1);
    } catch (err) {
      console.error('Lead submission failed', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 text-green-400 p-8 rounded-2xl text-center"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h4 className="text-2xl font-bold mb-2 text-white">Request Received!</h4>
        <p className="text-gray-400">Our team will contact you shortly.</p>

        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-green-400 underline hover:text-green-300"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="relative z-10 w-full overflow-hidden bg-black/20 p-2 rounded-2xl">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-gray-800 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: step >= i ? '100%' : '0%' }}
              className="h-full bg-primary"
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="min-h-[280px] relative px-2 pb-2">
        {error && (
          <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait" custom={1}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">What can we help you with?</h3>
              <div className="space-y-3">
                {['Buy a Motorcycle', 'Book a Test Ride', 'Financing Options', 'General Inquiry'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleInterestSelect(option)}
                    className="w-full text-left px-5 py-4 rounded-xl border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-primary/50 transition-all group flex items-center justify-between text-gray-300 hover:text-white"
                  >
                    {option}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setStep(1)} className="p-1 text-gray-500 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-white">Let's get your details</h3>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={!formData.name}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center mt-6 disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setStep(2)} className="p-1 text-gray-500 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-white">Almost there!</h3>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number *
                </label>
                <p className="text-xs text-gray-500 mb-3">We need this to contact you via WhatsApp or Call.</p>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="+91 9876543210"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.phone}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center mt-6 disabled:opacity-70 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Request'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}