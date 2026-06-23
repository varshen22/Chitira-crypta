import { Link } from 'react-router-dom';
import { LoginCard } from '../components/LoginCard';
import { Shield, Heart, SquarePlus } from 'lucide-react';

export function GeneralLogin() {
  return (
    <div className="page-general-login flex flex-col relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#004426]/5 blur-[100px]" />
      </div>

      {/* Side Decoration Watermark */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center opacity-10 pointer-events-none z-0">
        <div className="relative">
          <Shield size={320} strokeWidth={1} className="text-brand-primary" />
          <div className="absolute inset-0 flex items-center justify-center pt-8">
             <Heart size={120} strokeWidth={0} fill="currentColor" className="text-brand-primary" />
          </div>
        </div>
      </div>

      {/* Top Header */}
      <header className="flex items-center justify-center h-16 w-full fixed top-0 z-50 bg-[#F8F9FF] border-b border-brand-border">
        <h1 className="font-manrope text-2xl font-bold text-brand-primary tracking-tight">
          Chitra Crypta
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <LoginCard />
      </main>

      {/* Floating Action Badge - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/personnel-login" className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 group">
          <SquarePlus size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Medical Personnel Login</span>
        </Link>
      </div>
    </div>
  );
}
