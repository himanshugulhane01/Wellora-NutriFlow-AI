import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services';
import {
  X, Lock, Mail, User, Phone, AlertCircle, Sparkles, Eye, EyeOff,
  ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalDefaultMode,
    loginAndRedirect,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalDefaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Email OTP States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);

  // Sync mode when parent changes default
  useEffect(() => {
    setMode(authModalDefaultMode);
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setEmailOtpSent(false);
    setEmailOtpVerified(false);
    setEmailOtpInput('');
  }, [authModalDefaultMode, isAuthModalOpen]);

  useEffect(() => {
    if (emailResendTimer > 0) {
      const interval = setInterval(() => setEmailResendTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [emailResendTimer]);

  if (!isAuthModalOpen) return null;

  // Send Email OTP handler
  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setIsSendingEmailOtp(true);

    try {
      const res = await authService.sendEmailOtp(email, name);
      if (res.success) {
        setEmailOtpSent(true);
        setSuccessMsg(res.message || `Verification code sent to ${email}. Please check your inbox.`);
        setEmailResendTimer(30);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send verification email.');
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  // Verify Email OTP handler
  const handleVerifyEmailOtp = async () => {
    if (!emailOtpInput || emailOtpInput.length !== 6) {
      setError('Please enter the full 6-digit email OTP code.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setIsVerifyingEmailOtp(true);

    try {
      const res = await authService.verifyEmailOtp(email, emailOtpInput);
      if (res.success) {
        setEmailOtpVerified(true);
        setSuccessMsg('✅ Email address verified successfully!');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email OTP. Please check and try again.');
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Require Email OTP verification for signup
    if (mode === 'signup' && !emailOtpVerified) {
      setError('Please verify your email with the 6-digit verification code before registering.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await authService.login({ email, password });
        if (res.success) {
          if (res.data.user.role === 'ADMIN') {
            setError('Admin accounts cannot sign in through this customer portal. Please access the separate Admin Login Page at /admin.');
            setIsLoading(false);
            return;
          }
          await loginAndRedirect(res.data.user, res.data.token);
        } else {
          setError('Invalid email or password.');
        }
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        const res = await authService.register({ name, email, password, phone });
        if (res.success) {
          await loginAndRedirect(res.data.user, res.data.token);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Something went wrong. Please check backend server.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCustomerCredentials = () => {
    setEmail('priya@wellora.ai');
    setPassword('password123');
    setError(null);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setEmailOtpSent(false);
    setEmailOtpVerified(false);
    setEmailOtpInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">

        {/* Decorative top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 shrink-0" />

        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">

          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                {mode === 'login' ? 'Welcome Back!' : 'Join Wellora'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login'
                  ? 'Sign in to access your clinical health dashboard'
                  : 'Create your account with email verification'}
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 gap-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'login'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Email Address {mode === 'signup' && '(OTP Verified)'}</span>
                {mode === 'signup' && emailOtpVerified && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={mode === 'signup' && emailOtpVerified}
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-75"
                  />
                </div>
                {mode === 'signup' && !emailOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={isSendingEmailOtp || emailResendTimer > 0 || !email}
                    className="px-3.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-500 font-extrabold text-xs shrink-0 transition-all shadow-sm"
                  >
                    {isSendingEmailOtp ? 'Sending...' : emailResendTimer > 0 ? `${emailResendTimer}s` : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Email OTP Verification Input Box */}
              {mode === 'signup' && emailOtpSent && !emailOtpVerified && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[11px] font-bold text-emerald-800 text-center">
                    📧 6-digit verification code sent to your email. Enter below:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtpInput}
                      onChange={(e) => setEmailOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-emerald-300 text-center font-mono font-black text-sm tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={isVerifyingEmailOtp || emailOtpInput.length !== 6}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shrink-0 transition-all shadow-md"
                    >
                      {isVerifyingEmailOtp ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Mobile Number Section (Without OTP verification) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (mode === 'signup' && !emailOtpVerified)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Customer Demo Account Hint */}
          {mode === 'login' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-black text-emerald-800">
                  🧪 Demo Customer Account
                </div>
                <div className="text-[10px] text-emerald-600 font-mono">
                  priya@wellora.ai • password123
                </div>
              </div>
              <button
                type="button"
                onClick={fillCustomerCredentials}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm transition-all"
              >
                Auto-fill
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
