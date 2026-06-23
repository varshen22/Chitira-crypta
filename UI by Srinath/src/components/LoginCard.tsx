import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<'username' | 'password' | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* Security Badge */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
          <Lock size={32} fill="currentColor" />
        </div>
      </div>

      {/* Vault Card */}
      <div className="bg-brand-surface border border-brand-border rounded-xl vault-shadow overflow-hidden relative z-10">
        {/* Card Header */}
        <div className="bg-[#f8f9fc] p-6 border-b border-brand-border">
          <h1 className="font-manrope text-2xl font-semibold text-brand-primary text-center">
            Log In
          </h1>
        </div>

        {/* Form Section */}
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {/* Username / Email */}
          <div className="space-y-2">
            <label 
              htmlFor="identity" 
              className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors ${isFocused === 'username' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
            >
              Username / Email
            </label>
            <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} />
              </span>
              <input
                id="identity"
                type="text"
                placeholder="e.g. dr.chitra@hospital.org"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-transparent outline-none text-brand-text placeholder:text-gray-400"
                onFocus={() => setIsFocused('username')}
                onBlur={() => setIsFocused(null)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label 
                htmlFor="password" 
                className={`font-jetbrains text-xs font-semibold tracking-wider block transition-colors ${isFocused === 'password' ? 'text-brand-primary' : 'text-brand-text-muted'}`}
              >
                Password
              </label>
              <Link to="/general-forgot-password" className="text-sm font-semibold text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative input-focus-ring rounded-lg border border-brand-border bg-white transition-all">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-manrope text-lg font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Login</span>
            <ChevronRight size={20} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="px-8 pb-8 text-center space-y-4">
          <div className="h-px w-full bg-brand-border" />
          <p className="text-sm text-brand-text-muted pt-2">
            New to Chitra Crypta?{' '}
            <Link to="/signup" className="font-semibold text-brand-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
