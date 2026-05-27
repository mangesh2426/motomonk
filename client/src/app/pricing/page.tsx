import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '₹4,999',
      period: '/month',
      desc: 'Perfect for small businesses looking to automate basic lead capture.',
      features: [
        'AI Web Chatbot (Basic)',
        'Up to 500 Leads/month',
        'Standard Analytics',
        'Email Support',
        '1 User Account'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹14,999',
      period: '/month',
      desc: 'Ideal for growing companies needing WhatsApp & advanced AI features.',
      features: [
        'Advanced AI Web Chatbot',
        'WhatsApp Cloud API Integration',
        'Up to 2,000 Leads/month',
        'Custom AI Training',
        'Advanced Analytics Dashboard',
        'Priority Support',
        '3 User Accounts'
      ],
      buttonText: 'Choose Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Tailored solutions including AI voice calling for large scale operations.',
      features: [
        'Everything in Professional',
        'AI Voice Calling (Inbound/Outbound)',
        'Unlimited Leads',
        'Custom CRM Integration',
        'Dedicated Account Manager',
        'SLA Guarantee',
        'Unlimited User Accounts'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent <span className="text-primary">Pricing</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Choose the right plan for your business growth. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div key={idx} className={`bg-card rounded-3xl p-8 border ${plan.popular ? 'border-primary shadow-[0_0_30px_rgba(249,115,22,0.15)] relative' : 'border-gray-800'}`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-400 mb-6 text-sm">{plan.desc}</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-gray-400">{plan.period}</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              href="/contact" 
              className={`block w-full py-3 px-4 text-center rounded-xl font-bold transition-all ${
                plan.popular 
                ? 'bg-primary text-white hover:bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                : 'bg-background border border-gray-700 text-white hover:border-gray-500'
              }`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
