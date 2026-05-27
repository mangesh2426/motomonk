'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState('admin@motomonk.com');
  const [password, setPassword] = useState('123456');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://motomonk.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save the token to localStorage
        localStorage.setItem('adminToken', data.token);
        
        // Redirect to the dashboard
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
              Moto Monk Admin
            </h1>
            <p className="text-gray-400 text-sm">Sign in to manage leads and bots</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary text-white rounded-xl py-3 pl-12 pr-4 transition-all outline-none"
                  placeholder="admin@motomonk.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary text-white rounded-xl py-3 pl-12 pr-4 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary hover:bg-orange-600 disabled:opacity-70 disabled:hover:bg-primary text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
          </form>

          <div className="mt-8 text-center border-t border-gray-800/60 pt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              Protected by <Sparkles className="w-3.5 h-3.5 text-primary" /> Moto Monk Security
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
