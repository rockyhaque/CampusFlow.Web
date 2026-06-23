import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { authService } from '../../services/auth.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  backBtnMb,
  btnPrimary,
  btnSecondary,
  btnSecondarySm,
  cardTitle,
  formRequired,
  formStack,
  formNarrow,
  inputError,
  inputField,
  inputFieldError,
  inputFieldWithRightIcon,
  inputHint,
  inputIconRight,
  inputIconWrapRight,
  inputLabel,
  inputWrap,
} from '../../components/ui/componentClasses.js';
import {
  createAdminCard,
  createAdminFieldEnter,
  createAdminFormActions,
  createAdminNote,
  dashStagger,
  dashboardLoaded,
} from './usersClasses.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

export default function CreateAdminPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const toast = useToastStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name !== 'email' && name !== 'password') return;
    const nextErrors = validateForm({ ...form, [name]: e.target.value });
    if (nextErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(form.fullName.trim() ? { fullName: form.fullName.trim() } : {}),
      };
      await authService.registerAdmin(payload);
      toast.success('Admin account created successfully.');
      navigate('/users');
    } catch (e) {
      const message = e.response?.data?.message || 'Failed to create admin.';
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${dashboardLoaded}`}>
        <div className={formNarrow}>
          <header className={pageHeader}>
            <div>
              <h1 className={pageTitle}>Create admin</h1>
              <p className={pageSubtitle}>Create a new university-level admin account</p>
            </div>
          </header>

          <button
            type="button"
            className={`${btnSecondarySm} ${backBtnMb} ${createAdminFieldEnter}`}
            style={dashStagger(0).style}
            onClick={() => navigate('/users')}
            aria-label="Back to users list"
          >
            ← Back to users
          </button>

          <section
            className={`${createAdminCard} dashboard-section-enter`}
            style={dashStagger(1).style}
            aria-labelledby="create-admin-heading"
          >
            <div className="mb-4 flex items-center gap-2">
              <Icon name="shield" size={18} color="var(--purple-400)" aria-hidden />
              <h2 id="create-admin-heading" className={cardTitle}>New admin account</h2>
            </div>

            <div className={createAdminNote} role="note">
              <Icon name="checkCircle" size={16} color="var(--green-400)" aria-hidden />
              <span>Admin accounts are auto-approved and email-verified upon creation.</span>
            </div>

            {errors.form && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-500" role="alert">
                <Icon name="warning" size={16} aria-hidden />
                <span>{errors.form}</span>
              </div>
            )}

            <form className={formStack} onSubmit={handleSubmit} noValidate aria-busy={loading}>
              <div className={`${inputWrap} ${createAdminFieldEnter}`} style={dashStagger(2).style}>
                <label className={inputLabel} htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={inputField}
                  placeholder="University Faculty Administrator"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
                <p className={inputHint} id="fullName-hint">Optional — shown on the admin profile.</p>
              </div>

              <div className={`${inputWrap} ${createAdminFieldEnter}`} style={dashStagger(3).style}>
                <label className={inputLabel} htmlFor="email">
                  Email <span className={formRequired} aria-hidden>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={errors.email ? inputFieldError : inputField}
                  placeholder="admin@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className={inputError} role="alert">{errors.email}</p>
                )}
              </div>

              <div className={`${inputWrap} ${createAdminFieldEnter}`} style={dashStagger(4).style}>
                <label className={inputLabel} htmlFor="password">
                  Password <span className={formRequired} aria-hidden>*</span>
                </label>
                <div className={inputIconWrapRight}>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    className={`${errors.password ? inputFieldError : inputField} ${inputFieldWithRightIcon}`}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error password-hint' : 'password-hint'}
                    required
                  />
                  <button
                    type="button"
                    className={`${inputIconRight} border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35`}
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    aria-pressed={showPw}
                  >
                    <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
                <p className={inputHint} id="password-hint">At least 8 characters.</p>
                {errors.password && (
                  <p id="password-error" className={inputError} role="alert">{errors.password}</p>
                )}
              </div>

              <div className={`${createAdminFormActions} ${createAdminFieldEnter}`} style={dashStagger(5).style}>
                <button type="button" className={btnSecondary} onClick={() => navigate('/users')} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className={btnPrimary} disabled={loading} aria-live="polite">
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      Creating…
                    </>
                  ) : (
                    'Create admin'
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
