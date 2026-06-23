import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import AppLogo from '../../components/ui/AppLogo.jsx';
import { authCard, authFooter, authForm, authLogo, authSubtitle, authTitle } from '../../components/layout/layoutClasses.js';
import Icon from '../../components/ui/Icon.jsx';
import { btnPrimaryFullLg, btnSecondarySm, inputField, inputIcon, inputIconRight, inputIconWrap, inputIconWrapRight, inputLabel, inputWrap } from '../../components/ui/componentClasses.js';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login, isLoading } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUnverifiedEmail('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      const { user } = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${user.fullName || user.email}!`);
      navigate('/dashboard');
    } catch (err) {
      if (err.message?.toLowerCase().includes('verify your email')) {
        setUnverifiedEmail(form.email.trim());
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className={authCard}>
      <div className={authLogo}>
        <AppLogo size="lg" />
      </div>

      <h1 className={authTitle}>Sign in</h1>
      <p className={authSubtitle}>Enter your credentials to access the platform.</p>

      <form className={authForm} onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="email">Email address</label>
          <div className={inputIconWrap}>
            <span className={inputIcon}>
              <Icon name="atSign" size={16} strokeWidth={1.75} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              className={inputField}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="password">Password</label>
          <div className={inputIconWrapRight}>
            <span className={inputIcon}>
              <Icon name="lock" size={16} strokeWidth={1.75} />
            </span>
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              className={inputField}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <span className={inputIconRight} onClick={() => setShowPw(!showPw)}>
              <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} strokeWidth={1.75} />
            </span>
          </div>
        </div>

        <div className="-mt-2 flex justify-end">
          <Link to="/forgot-password" className="text-[13px]">Forgot password?</Link>
        </div>

        {unverifiedEmail && (
          <div className="flex flex-col gap-2 rounded-[10px] border border-amber-500/[0.35] bg-amber-500/[0.08] px-3.5 py-3">
            <div className="text-[13px] font-medium text-primary">
              Your email isn't verified yet
            </div>
            <div className="text-xs leading-normal text-muted">
              Check your inbox for the 6-digit code we sent to <strong>{unverifiedEmail}</strong>.
            </div>
            <button
              type="button"
              className={`${btnSecondarySm} mt-0.5 self-start`}
              onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}&from=login`)}
            >
              Verify my email →
            </button>
          </div>
        )}

        <button type="submit" className={btnPrimaryFullLg} disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : 'Sign in'}
        </button>
      </form>

      <div className={authFooter}>
        Don&apos;t have an account?{' '}
        <Link to="/register">Create one</Link>
      </div>
    </div>
  );
}
