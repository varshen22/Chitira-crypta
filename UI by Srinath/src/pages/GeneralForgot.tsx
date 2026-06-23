import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, Send, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';

export function GeneralForgot() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubmittedEmail(emailInput);
    }
  };

  return (
    <div className="page-general-forgot font-sans text-on-surface min-h-screen flex flex-col items-center relative overflow-hidden bg-app-bg selection:bg-primary/20">
       {/* Background VAULT text */}
      <div className="fixed bottom-0 left-0 p-12 opacity-[0.03] pointer-events-none hidden md:block">
        <span className="font-mono text-[160px] font-bold leading-none text-primary select-none mix-blend-multiply">
          VAULT
        </span>
      </div>

       <header className="w-full py-12 flex justify-center items-center relative z-10">
        <h1 className="font-heading text-3xl md:text-[32px] font-extrabold text-primary tracking-tight">
          Chitra Crypta
        </h1>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 md:px-12 pt-8 pb-20 w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: 'easeOut' }}
           className="vault-card w-full max-w-[448px] rounded-[12px] overflow-hidden transition-all duration-500 hover:shadow-xl"
        >
          {/* Card Header */}
          <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant">
            <div className="flex items-center gap-3 mb-2">
              <KeyRound className="text-tertiary w-6 h-6" />
              <h2 className="font-heading text-2xl font-semibold text-on-surface tracking-tight">Reset Password</h2>
            </div>
            <p className="text-on-surface-variant text-[16px] leading-relaxed">
              Enter your email address to receive a recovery link.
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {!submittedEmail ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-mono text-[12px] font-semibold text-primary uppercase tracking-[0.05em] block">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant w-[20px] h-[20px] group-focus-within:text-primary transition-colors" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="name@medicalvault.com"
                        className="w-full pl-[42px] pr-4 py-3 bg-white border border-outline-variant rounded-lg text-[16px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full bg-primary-container text-white font-heading text-[16px] leading-[24px] font-semibold py-4 rounded-lg overflow-hidden shadow-md active:scale-[0.98] transition-all hover:bg-opacity-90 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10">Send Reset Link</span>
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col items-center text-center space-y-4 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center text-on-tertiary-fixed mb-2"
                  >
                    <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="font-heading text-2xl font-semibold text-primary tracking-tight">Email Sent</h3>
                  <p className="text-on-surface-variant text-[16px] leading-relaxed">
                    If an account exists for <span className="font-bold text-on-surface">{submittedEmail}</span>, you will receive password reset instructions shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-outline-variant flex justify-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-[16px] text-tertiary-container hover:text-tertiary transition-colors group"
              >
                <ArrowLeft className="w-[18px] h-[18px] transition-transform group-hover:-translate-x-1" />
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Security Badge Footer */}
      <footer className="w-full py-6 flex flex-col items-center gap-2 relative z-10 mb-4 opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-highest rounded-full border border-outline-variant">
          <ShieldCheck className="text-primary w-4 h-4" />
          <span className="font-mono text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
            End-to-End Encrypted Verification
          </span>
        </div>
        <p className="font-mono text-[10px] text-outline uppercase tracking-tight text-center px-4">
          © 2024 Chitra Crypta Health Systems. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
