import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, RefreshCcw, Send, ArrowLeft, IdCard, AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PersonnelForgot() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const amount = 5;
      const x = (e.clientX / window.innerWidth - 0.5) * amount;
      const y = (e.clientY / window.innerHeight - 0.5) * amount;
      document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="page-medical-forgot min-h-screen flex flex-col items-center justify-between px-4 py-8 md:py-12 relative overflow-hidden">
      
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md z-10">
        <header className="text-center mb-8">
          <h1 className="font-headline text-[32px] md:text-4xl font-bold text-primary tracking-tight mb-2">Chitra Crypta</h1>
          <p className="font-mono text-xs md:text-[12px] text-tertiary-container tracking-widest uppercase font-semibold">Medical Personnel Portal</p>
        </header>

        <div className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm overflow-hidden bg-white/80 backdrop-blur-md">
          <div className="bg-surface-container-low px-6 py-6 border-b border-surface-variant">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCcw className="text-primary w-6 h-6" />
              <h2 className="font-headline text-2xl font-semibold text-on-surface">Password Reset</h2>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Enter your Hospital Medical License ID and registered email to verify your identity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="license-id" className="block font-mono text-xs tracking-[0.05em] text-primary font-semibold">
                Medical License ID
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-[20px] h-[20px]" />
                <input 
                  id="license-id"
                  name="license-id"
                  placeholder="e.g. MED-7742-XP"
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-[0.5rem] focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-xs tracking-[0.05em] text-primary font-semibold">
                Registered Email
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-[20px] h-[20px]" />
                <input
                  id="email"
                  name="email"
                  placeholder="personnel@hospital.com"
                  required
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-[0.5rem] focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body text-on-surface"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`w-full font-headline text-base font-semibold py-4 rounded-[0.5rem] transition-all flex items-center justify-center gap-2 group ${
                isSubmitted 
                  ? 'bg-tertiary-container text-white' 
                  : 'bg-primary-container text-on-primary-container hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <span>Verification Sent</span>
                </>
              ) : (
                <>
                  <span>Verify & Send Reset Link</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/personnel-login" className="inline-flex items-center gap-1 font-body text-sm text-primary hover:underline transition-all group">
                <ArrowLeft className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
                Back to Medical Login
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto mt-12 py-8 border-t border-surface-variant flex flex-col md:flex-row items-center justify-between gap-6 z-10 px-4 md:px-12">
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-5 h-5" />
            <span className="font-mono text-xs tracking-[0.05em] font-semibold text-on-surface">HIPAA COMPLIANT</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="text-primary w-5 h-5" />
            <span className="font-mono text-xs tracking-[0.05em] font-semibold text-on-surface">AES-256 ENCRYPTED</span>
          </div>
        </div>
        <div className="text-on-surface-variant font-mono text-xs tracking-[0.05em] uppercase opacity-50 text-center">
          © 2024 Chitra Crypta Health Systems. All Rights Reserved.
        </div>
      </footer>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 bg-tertiary-container text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 z-50 bounce-sm"
          >
            <ShieldCheck className="w-6 h-6 fill-current text-white" strokeWidth={1.5} />
            <p className="font-body font-medium">Verification link sent to your clinical inbox.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
