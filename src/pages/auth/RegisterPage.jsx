import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import AppLogo from '../../components/ui/AppLogo.jsx';
import { authCard, authFooter, authForm, authLogo, authSubtitle, authTitle } from '../../components/layout/layoutClasses.js';
import Icon from '../../components/ui/Icon.jsx';
import { btnPrimaryFullLg, inputField, inputFieldWithRightIcon, inputIconRight, inputIconWrapRight, inputLabel, inputWrap } from '../../components/ui/componentClasses.js';

const roles = [
  { value: 'VOLUNTEER', label: 'Volunteer', desc: 'Help at events, earn hours & certificates' },
  { value: 'ORGANIZER', label: 'Organizer', desc: 'Create and manage university events' },
  { value: 'ATTENDEE', label: 'Attendee', desc: 'Purchase tickets and attend events' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'VOLUNTEER' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const toast = useToastStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.fullName?.trim()) delete payload.fullName;
      const res = await authService.register(payload);
      // ATTENDEE skips OTP — go straight to login
      if (res.data?.verified) {
        toast.success('Account created! You can now log in.');
        navigate('/login');
      } else {
        toast.success('Code sent! Check your email.');
        navigate(`/verify-otp?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={authCard}>
      <div className={authLogo}>
        <AppLogo size="lg" />
      </div>

      <h1 className={authTitle}>Create account</h1>
      <p className={authSubtitle}>Join the CampusFlow platform today.</p>

      <form className={authForm} onSubmit={handleSubmit} noValidate>
        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={inputField}
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="email">Email address <span className="text-red-400">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputField}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="password">Password <span className="text-red-400">*</span></label>
          <div className={inputIconWrapRight}>
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              className={inputFieldWithRightIcon}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <span className={inputIconRight} onClick={() => setShowPw(!showPw)}>
              <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} strokeWidth={1.75} />
            </span>
          </div>
        </div>

        <div className={inputWrap}>
          <label className={inputLabel}>I am a… <span className="text-red-400">*</span></label>
          <div className="flex flex-col gap-2">
            {roles.map((r) => (
              <label
                key={r.value}
                className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-3.5 py-3 transition-[border-color,background] duration-[120ms] ${form.role === r.value ? 'border-purple-600 bg-violet-500/[0.06]' : 'border-slate-900/12 bg-transparent'}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={form.role === r.value}
                  onChange={handleChange}
                  className="mt-0.5 accent-purple-600"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">{r.label}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{r.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className={btnPrimaryFullLg} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Create account'}
        </button>
      </form>

      <div className={authFooter}>
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
