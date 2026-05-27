import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingBots from '@/components/FloatingBots';
import LiveChatWidget from '@/components/LiveChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moto Monk | AI-Powered Lead Generation',
  description: 'Moto Monk uses cutting-edge AI to supercharge your lead generation. Automate your sales pipeline with our intelligent chatbot, WhatsApp integration, and AI calling solutions.',
  keywords: 'AI lead generation, Moto Monk, AI Chatbot, WhatsApp bot, AI calling, business automation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingBots />
        <LiveChatWidget />
      </body>
    </html>
  );
}
