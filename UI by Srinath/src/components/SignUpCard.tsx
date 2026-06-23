import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ChevronRight, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<'name' | 'email' | 'password' | 'otp' | null>(null);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      setStep('otp');
    } else {
      // OTP verified, redirect to login
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* Security Badge */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
          {step === 'details' ? <Lock size={32} fill="currentColor" /> : <CheckCircle2 size={32} />}
        </div>
      </div>

      {/* Vault Card */}
      <div className="bg-brand-surface border border-brand-border rounded-xl vault-shadow overflow-hidden relative z-10">
        {/* Card Header */}
        <div className="bg-[#f8f9fc] p-6 border-b border-brand-border">
          <h1 className="font-manrope text-2xl font-semibold text-brand-primary text-center">
            {step === 'details' ? 'Create Account' : 'Verify Email'}
          </h1>
        </div>

        {/* Form Section */}
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {step === 'details' ? (
            <>
              {/* Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors ${isFocused === 'name' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
                >
                  Full Name
                </label>
                <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Dr. Chitra"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-transparent outline-none text-brand-text placeholder:text-gray-400"
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors ${isFocused === 'email' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
                >
                  Email Address
                </label>
                <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dr.chitra@hospital.org"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-transparent outline-none text-brand-text placeholder:text-gray-400"
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused(null)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors ${isFocused === 'password' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
                >
                  Password
                </label>
                <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-transparent outline-none text-brand-text placeholder:text-gray-400"
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* OTP Field */}
              <div className="text-center mb-6">
                <p className="text-sm text-brand-text-muted mb-2">
                  We've sent a 6-digit one-time password to
                </p>
                <p className="font-semibold text-brand-text">{email || 'your email'}</p>
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="otp" 
                  className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors text-center ${isFocused === 'otp' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
                >
                  Enter Verification Code
                </label>
                <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyRound size={20} />
                  </span>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    required
                    className="w-full pl-10 pr-4 py-4 rounded-lg bg-transparent outline-none text-brand-text placeholder:text-gray-400 text-center text-xl tracking-[0.5em] font-mono"
                    onFocus={() => setIsFocused('otp')}
                    onBlur={() => setIsFocused(null)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-manrope text-lg font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{step === 'details' ? 'Create Account' : 'Verify & Complete'}</span>
            <ChevronRight size={20} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="px-8 pb-8 text-center space-y-4">
          <div className="h-px w-full bg-brand-border" />
          <p className="text-sm text-brand-text-muted pt-2">
            {step === 'details' ? (
              <>
                Already have an account?{' '}
                <Link to="/" className="font-semibold text-brand-primary hover:underline">
                  Log in
                </Link>
              </>
            ) : (
              <button 
                type="button" 
                onClick={() => setStep('details')}
                className="font-semibold text-brand-primary hover:underline"
              >
                Back to details
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
