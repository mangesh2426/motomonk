import { Bot, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-primary">Moto Monk</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          We are pioneers in AI-driven lead generation and customer engagement automation. Our mission is to help businesses scale effortlessly by leveraging the power of Artificial Intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            Founded with a vision to revolutionize how businesses interact with their customers, Moto Monk started as a small team of AI enthusiasts. We noticed that companies were losing valuable leads due to delayed responses and inefficient capture methods.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Today, we provide state-of-the-art AI Chatbots, WhatsApp automation, and AI voice calling solutions that operate 24/7. Our technology ensures that no inquiry goes unanswered and every lead is captured, qualified, and routed to your sales team instantly.
          </p>
        </div>
        <div className="bg-card border border-gray-800 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-background p-6 rounded-2xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">99%</h3>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
            <div className="bg-background p-6 rounded-2xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-sm text-gray-400">Support</p>
            </div>
            <div className="bg-background p-6 rounded-2xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">5x</h3>
              <p className="text-sm text-gray-400">Lead Conversion</p>
            </div>
            <div className="bg-background p-6 rounded-2xl text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
              <p className="text-sm text-gray-400">Chats Automated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Bot className="w-8 h-8 text-primary" />, title: 'Innovation', desc: 'Constantly pushing the boundaries of AI technology.' },
            { icon: <Target className="w-8 h-8 text-primary" />, title: 'Result-Driven', desc: 'Focused on delivering measurable ROI for our clients.' },
            { icon: <Users className="w-8 h-8 text-primary" />, title: 'Customer First', desc: 'Your success is our success. We build for your needs.' },
            { icon: <Zap className="w-8 h-8 text-primary" />, title: 'Speed', desc: 'Lightning-fast deployments and real-time responses.' },
          ].map((val, idx) => (
            <div key={idx} className="bg-card border border-gray-800 p-6 rounded-2xl hover:border-primary/50 transition-colors text-center flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{val.title}</h3>
              <p className="text-gray-400 text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
