'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { name: 'Michael from Texas', action: 'just booked a test ride', time: 'Just now' },
  { name: 'Sarah from London', action: 'requested a quote', time: '2 mins ago' },
  { name: 'David from Sydney', action: 'started a live chat', time: '5 mins ago' },
  { name: 'Emma from New York', action: 'bought a Ninja 400', time: '10 mins ago' },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first toast after 3 seconds
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Then cycle through every 15 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MOCK_NOTIFICATIONS.length);
        setIsVisible(true);
      }, 1000); // Wait 1 second before showing the next one
      
      setTimeout(() => {
        setIsVisible(false);
      }, 6000); // Hide after 5 seconds of being visible
    }, 15000);

    // Initial hide timeout
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, []);

  const notification = MOCK_NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="bg-card border border-gray-800 rounded-2xl p-4 shadow-2xl flex items-start gap-4 max-w-sm pointer-events-auto backdrop-blur-xl bg-opacity-90"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">{notification.name}</span>{' '}
                {notification.action}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
