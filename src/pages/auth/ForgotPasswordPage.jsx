import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import AppLogo from '../../components/ui/AppLogo.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { authCard, authFooter, authForm, authLogo, authSubtitle, authTitle } from '../../components/layout/layoutClasses.js';
import { btnPrimaryFull, btnSecondarySm, inputField, inputLabel, inputWrap } from '../../components/ui/componentClasses.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address.'); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
      toast.success('Reset link sent if that email is registered.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={authCard}>
      <div className={authLogo}>
        <AppLogo size="lg" />
      </div>

      <h1 className={authTitle}>Forgot password?</h1>
      <p className={authSubtitle}>Enter your email and we'll send a reset link.</p>

      {sent ? (
        <div className="py-5 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-400/10 text-accent">
            <Icon name="mailOpen" size={28} strokeWidth={1.6} />
          </div>
          <p className="text-sm text-muted">
            If <strong className="text-default">{email}</strong> is registered, check your inbox.
          </p>
          <Link to="/login" className={`${btnSecondarySm} mt-5`}>Back to login</Link>
        </div>
      ) : (
        <>
          <form className={authForm} onSubmit={handleSubmit}>
            <div className={inputWrap}>
              <label className={inputLabel} htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={inputField}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={btnPrimaryFull} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Send reset link'}
            </button>
          </form>

          <div className={authFooter}>
            <Link to="/login" className="inline-flex items-center gap-1.5">
              <Icon name="arrowLeft" size={14} /> Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
