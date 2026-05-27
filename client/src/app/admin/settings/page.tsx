'use client';

import { useState, useEffect } from 'react';
import { User, Key, Bot, Save, Copy, CheckCircle2, MessageCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [settings, setSettings] = useState({
    assistantName: 'Moto Monk Sales Assistant',
    systemPrompt: 'You are a helpful sales assistant...',
    humanHandoff: true,
    productionSecretKey: '',
    whatsappWebhookVerifyToken: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('https://motomonk.onrender.com/api/settings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://motomonk.onrender.com/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save settings.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="p-8 text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings & API Config</h1>
        <p className="text-gray-400 mt-1">Manage your account and configure system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-gray-800 rounded-2xl p-2 flex flex-row md:flex-col gap-1 overflow-x-auto shadow-xl">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'profile' 
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="w-5 h-5" /> Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'api' 
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Key className="w-5 h-5" /> API Keys
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'bot' 
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Bot className="w-5 h-5" /> Bot Configuration
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'whatsapp' 
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Integration
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-800">Profile Information</h2>
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue="admin@motomonk.com"
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="pt-4">
                  <button className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold mb-2">API Keys</h2>
              <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-gray-800">Manage your secret keys for external integrations.</p>
              
              <div className="space-y-6 max-w-2xl">
                <div className="bg-black/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Production Secret Key</h3>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={settings.productionSecretKey}
                      onChange={(e) => setSettings({...settings, productionSecretKey: e.target.value})}
                      placeholder="sk_test_..."
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 outline-none focus:border-primary"
                    />
                    <button 
                      onClick={() => handleCopy(settings.productionSecretKey)}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 text-white px-4 py-2.5 rounded-lg transition-all"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                
                <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Save className="w-4 h-4" /> Save Keys
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bot' && (
            <div className="bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold mb-2">Bot Configuration</h2>
              <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-gray-800">Customize the behavior of your AI assistant.</p>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Assistant Name</label>
                  <input
                    type="text"
                    value={settings.assistantName}
                    onChange={(e) => setSettings({...settings, assistantName: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">System Prompt / Instructions</label>
                  <textarea
                    rows={6}
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="flex items-center justify-between w-full max-w-sm bg-black border border-gray-800 p-4 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white text-sm">Handoff to Human</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Allow users to request human support</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.humanHandoff}
                        onChange={(e) => setSettings({...settings, humanHandoff: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold mb-2">WhatsApp Webhook Setup</h2>
              <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-gray-800">Configure your connection to the Meta WhatsApp Business API.</p>
              
              <div className="space-y-6 max-w-2xl">
                <div className="bg-black/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Webhook Verify Token</h3>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={settings.whatsappWebhookVerifyToken}
                      onChange={(e) => setSettings({...settings, whatsappWebhookVerifyToken: e.target.value})}
                      placeholder="e.g. my_secret_verify_token_123"
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 outline-none focus:border-primary"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter this token in your Meta App Dashboard when setting up the webhook.</p>
                </div>
                
                <div className="bg-black/50 border border-gray-800 rounded-xl p-5">
                  <h3 className="font-medium text-white mb-2">Your Webhook URL</h3>
                  <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-green-400 font-mono text-sm">
                    https://your-domain.com/api/whatsapp/webhook
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Provide this URL to Meta to receive incoming WhatsApp messages.</p>
                </div>

                <div className="pt-2">
                  <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <Save className="w-4 h-4" /> Save WhatsApp Config
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
