import { MessageSquare, PhoneCall, Zap, Code, BarChart, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      icon: <MessageSquare className="w-10 h-10 text-primary" />,
      title: 'AI Web Chatbot',
      desc: 'Deploy an intelligent, custom-trained AI assistant on your website. It answers FAQs, guides visitors, and collects contact information seamlessly.',
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: 'WhatsApp Automation',
      desc: 'Integrate with the WhatsApp Cloud API. Send automated replies, broadcast promotional messages, and handle customer support directly on WhatsApp.',
    },
    {
      icon: <PhoneCall className="w-10 h-10 text-primary" />,
      title: 'AI Voice Calling',
      desc: 'Utilize state-of-the-art voice AI to make outbound calls, verify leads, and schedule appointments. Get complete transcripts and summaries of every call.',
    },
    {
      icon: <Code className="w-10 h-10 text-primary" />,
      title: 'Custom Integration',
      desc: 'Connect our AI tools with your existing CRM, marketing software, or databases via custom APIs and webhooks.',
    },
    {
      icon: <BarChart className="w-10 h-10 text-primary" />,
      title: 'Lead Analytics',
      desc: 'Gain deep insights into your lead generation performance. Track conversion rates, popular queries, and engagement metrics from our comprehensive dashboard.',
    },
    {
      icon: <Settings className="w-10 h-10 text-primary" />,
      title: 'Managed Services',
      desc: 'Don\'t want to deal with technical setup? Our team handles everything from AI training to deployment and continuous optimization.',
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our <span className="text-primary">Services</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Comprehensive AI solutions designed to capture leads, engage customers, and skyrocket your sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, idx) => (
          <div key={idx} className="bg-card border border-gray-800 p-8 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-2 group">
            <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {service.desc}
            </p>
            <Link href="/contact" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Learn more &rarr;
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-card border border-gray-800 rounded-3xl p-10 md:p-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Not sure which service fits your needs?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Schedule a free consultation with our AI experts to identify the best automation strategy for your business.</p>
        <Link href="/contact" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] inline-block">
          Book a Free Consultation
        </Link>
      </div>
    </div>
  );
}
