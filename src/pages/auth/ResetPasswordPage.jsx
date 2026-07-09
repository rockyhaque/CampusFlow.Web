import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import AppLogo from '../../components/ui/AppLogo.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { authCard, authFooter, authForm, authLogo, authSubtitle, authTitle } from '../../components/layout/layoutClasses.js';
import { btnPrimaryFullLg, inputFieldWithIcon, inputFieldWithBothIcons, inputIcon, inputIconRight, inputIconWrap, inputIconWrapRight, inputLabel, inputWrap } from '../../components/ui/componentClasses.js';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const toast = useToastStore();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className={authCard}>
        <div className={authLogo}>
          <AppLogo size="lg" />
        </div>
        <h1 className={authTitle}>Invalid reset link</h1>
        <p className={authSubtitle}>This link is missing a reset token. Please request a new one.</p>
        <div className={authFooter}>
          <Link to="/forgot-password">Request a new link</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success('Password updated. You can now sign in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={authCard}>
        <div className={authLogo}>
          <AppLogo size="lg" />
        </div>
        <h1 className={authTitle}>Password updated</h1>
        <p className={authSubtitle}>You can now sign in with your new password.</p>
        <div className="pt-3 pb-1 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Icon name="checkCircle" size={28} strokeWidth={1.6} />
          </div>
          <button type="button" className={btnPrimaryFullLg} onClick={() => navigate('/login')}>
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={authCard}>
      <div className={authLogo}>
        <AppLogo size="lg" />
      </div>

      <h1 className={authTitle}>Set a new password</h1>
      <p className={authSubtitle}>Choose a strong password with at least 8 characters.</p>

      <form className={authForm} onSubmit={handleSubmit} noValidate>
        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="password">New password</label>
          <div className={inputIconWrapRight}>
            <span className={inputIcon}>
              <Icon name="lock" size={16} strokeWidth={1.75} />
            </span>
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              className={inputFieldWithBothIcons}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span className={inputIconRight} onClick={() => setShowPw(!showPw)}>
              <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} strokeWidth={1.75} />
            </span>
          </div>
        </div>

        <div className={inputWrap}>
          <label className={inputLabel} htmlFor="confirm">Confirm new password</label>
          <div className={inputIconWrap}>
            <span className={inputIcon}>
              <Icon name="lock" size={16} strokeWidth={1.75} />
            </span>
            <input
              id="confirm"
              type={showPw ? 'text' : 'password'}
              className={inputFieldWithIcon}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className={btnPrimaryFullLg} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Update password'}
        </button>
      </form>

      <div className={authFooter}>
        <Link to="/login" className="inline-flex items-center gap-1.5">
          <Icon name="arrowLeft" size={14} /> Back to login
        </Link>
      </div>
    </div>
  );
}
