import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { User } from '../../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'exhibitor' | 'judge'>('exhibitor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoUsers, setDemoUsers] = useState<Array<{ name: string; email: string; role: string; label: string; badge: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      api.getDemoUsers().then((users) => {
        if (users.length > 0) setDemoUsers(users);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({ name, email, password, role });
        onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(demoEmail, 'admin123');
      onSuccess(res.user);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              PawExcellence Authentication
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display mt-0.5">
              {mode === 'login' ? 'Exhibitor & Judge Portal' : 'Register Show Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Accounts Quick Sign-In */}
        {demoUsers.length > 0 && (
          <div className="px-6 pt-5 pb-3 bg-slate-50 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant 1-Click Demo Logins</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoUsers.map((dUser, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemoLogin(dUser.email)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {dUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {dUser.label}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                    <span>Login as {dUser.badge} →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode('login');
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode('register');
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Katherine Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="exhibitor">Exhibitor / Handler</option>
                  <option value="judge">Official Ring Judge</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted with bcrypt & signed with JWT in MongoDB</span>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs text-slate-600 hover:text-slate-900 underline transition-colors cursor-pointer"
            >
              {mode === 'login' ? 'Register new account' : 'Existing exhibitor sign in'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
