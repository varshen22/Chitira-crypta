import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldPlus,
  IdCard,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Shield,
  Lock,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { motion } from 'motion/react';

export function PersonnelLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<'license' | 'password' | null>(null);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="page-medical-login min-h-screen flex flex-col font-body text-on-surface w-full overflow-hidden">
      {/* Header */}
      <header className="w-full pt-12 pb-6 px-4 md:px-12 text-center">
        <h1 className="font-headline text-[32px] leading-[40px] font-bold text-primary tracking-tight">
          Chitra Crypta
        </h1>
        <p className="font-label text-[12px] leading-[16px] text-[#5adc95] mt-2 uppercase tracking-widest font-semibold">
          Medical Personnel Portal
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-surface-container-lowest border border-surface-container-highest rounded-xl p-8 md:p-10 relative overflow-hidden shadow-[0_10px_30px_-5px_rgba(13,92,77,0.05)]"
        >
          {/* Contextual Background Icon */}
          <div className="absolute -top-6 -right-6 opacity-5 pointer-events-none">
            <Stethoscope className="w-[120px] h-[120px] text-primary" strokeWidth={1.5} />
          </div>

          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full mb-4">
              <ShieldPlus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-headline text-[24px] leading-[32px] font-semibold text-on-surface">
              Secure Access
            </h2>
            <p className="font-body text-[14px] leading-[20px] text-secondary mt-1">
              Personnel authentication required for vault decryption.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Field 1 */}
            <div className={`transition-transform duration-200 ${isFocused === 'license' ? 'scale-[1.01]' : ''}`}>
              <label htmlFor="license" className="block font-label text-[12px] text-on-surface-variant mb-2">
                Hospital Medical License ID
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  id="license"
                  name="license"
                  type="text"
                  placeholder="e.g., MED-992-001"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all font-body text-[16px] text-on-surface"
                  onFocus={() => setIsFocused('license')}
                  onBlur={() => setIsFocused(null)}
                />
              </div>
            </div>

            {/* Field 2 */}
            <div className={`transition-transform duration-200 ${isFocused === 'password' ? 'scale-[1.01]' : ''}`}>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block font-label text-[12px] text-on-surface-variant">
                  Password
                </label>
                <Link to="/personnel-forgot-password" className="text-[11px] font-label text-tertiary-container hover:text-primary transition-colors">
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border border-outline-variant rounded-lg py-3 pl-11 pr-12 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all font-body text-[16px] text-on-surface"
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary-container text-on-primary py-4 px-6 rounded-lg font-headline text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20 mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Verify Credentials
            </motion.button>
          </form>

          {/* Secondary Links */}
          <div className="mt-10 pt-6 border-t border-surface-container-highest text-center">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-[14px] text-secondary hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to General Login
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Visual Identity Background Element */}
      <div className="fixed bottom-0 left-0 w-full opacity-10 pointer-events-none z-0 flex justify-center overflow-hidden">
        <ClipboardList className="w-[40vw] h-[40vw] text-primary" strokeWidth={1} style={{ transform: 'translateY(25%)' }} />
      </div>

      {/* Footer Security Compliance */}
      <footer className="w-full py-12 px-4 md:px-12 z-10 relative mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Security Tags */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30">
              <Shield className="w-4 h-4 text-primary fill-primary/10" />
              <span className="font-label text-[10px] font-semibold text-on-surface-variant uppercase">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30">
              <Lock className="w-4 h-4 text-primary fill-primary/10" />
              <span className="font-label text-[10px] font-semibold text-on-surface-variant uppercase">
                AES-256 Bit Encryption
              </span>
            </div>
          </div>

          {/* Footer Meta */}
          <div className="text-center md:text-right">
            <p className="font-label text-[10px] font-semibold text-on-secondary-container uppercase tracking-wider mb-2">
              Authenticated Infrastructure
            </p>
            <div className="flex items-center justify-center md:justify-end gap-3 opacity-40 mix-blend-multiply">
              <div 
                className="w-12 h-6 bg-contain bg-center bg-no-repeat grayscale" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUPSBAbfmqhpyHngfpRbX5hWoFypuPo2ub1cC3WAuy2FfEY3CTmJqP9Ru50-0p6Tci_kWIbCjIeRqHc8rPOinOA1p8A-vpx1NvAn0AJOO5zI2-5M9pQ_yhdMpWOeTIGE8HE5EYmywBr0ZU_v9vQ0m5jtxm_VJZFS_ukfnYPwfW2xOqmV1RGs5Z8k5Y-ujxfD9b9YeJDFFFyKSvy9VlQRZwJ21yqay6FXIM-SbJ4p-QymiQ54F2zeWJgvjrQrne8xUop2EmpdJ9OPs')" }}
              />
              <div 
                className="w-12 h-6 bg-contain bg-center bg-no-repeat grayscale" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAKJWSxib_iPJ8rNCIrnhVz2eH91_m32vyVo7ewBb_gklCiRaOYo6H9keqyw9F5Bu5ohVFbuIHZHXT_us8Rr9C9fQuAavn_uE8PsSAKhVzzLUy_MPWRrY95Xflgo0QR5cQic3-zbgJbBSHBbNmiCaFObfOpaWQWvCLe_q50bKe30bhANNbXZelqCggxDuGCjd2GQxLzpe2u0MwwM2KvyMhpp_0TI4CxJSIJ2QeInNA2_ym4GcXjCXSv5nezRTRQEB5Ny1C_PRETpU')" }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center border-t border-tertiary-container/10 pt-6">
          <p className="font-body text-[12px] text-outline">
            © 2024 Chitra Crypta Healthcare Systems. All access is logged and monitored for security purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
