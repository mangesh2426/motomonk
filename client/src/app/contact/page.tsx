import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in <span className="text-primary">Touch</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Have questions about our AI solutions? Our team is here to help you automate your business.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Office</h3>
                <p className="text-gray-400 leading-relaxed">
                  SHOP NUMBER 17, MUBARAK COMPLEX, Uttan Rd, near SECONDARY SCHOOL, 
                  Bhayandar, Chandulal Park, Bhayandar West, 
                  Mira Bhayandar, Maharashtra 401101
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-gray-400">
                  <a href="tel:9769745585" className="hover:text-primary transition-colors">+91 9769745585</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-400">
                  <a href="mailto:hello@motomonk.com" className="hover:text-primary transition-colors">hello@motomonk.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
                <p className="text-gray-400">Mon - Sat: 10:00 AM - 7:00 PM</p>
                <p className="text-gray-400">Sun: Closed (AI Bots never sleep though!)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-gray-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-6 relative z-10">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-gray-800">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.19523789174!2d72.8447814!3d19.2738927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0638166c4c9%3A0xb36fc5e4d2a14e91!2sMubarak%20Complex!5e0!3m2!1sen!2sin!4v1716382023120!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        ></iframe>
      </div>
    </div>
  );
}
