import { useEffect, useState, useCallback } from 'react';
import Topbar from '../../components/layout/Topbar.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { PageSpinner, Spinner } from '../../components/ui/Spinner.jsx';
import { usersService } from '../../services/users.service.js';
import { authService } from '../../services/auth.service.js';
import useAuthStore from '../../stores/useAuthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { pageContent } from '../../components/layout/layoutClasses.js';
import { btnDangerSm, btnGhostSm, btnPrimaryFull, btnPrimarySm, inputField, inputLabel, inputSelect, inputWrap, textareaField } from '../../components/ui/componentClasses.js';
import {
  profileShell, profileCard, profileCover, profileCoverPattern, profileCoverPatternBg, profileHero,
  profilePhotoWrap, profilePhotoBtn, profileHeroMeta, profileHeroName, profileHeroSub,
  profileHeroEmail, profileTabs, profileTab, profileBody, profileGrid, profileSection,
  profileSectionHead, profileSectionTitle, profileEditLink, profileKv, profileKvRow,
  profileK, profileV, profileMuted, profileSkillChips, profileSkillChipActive,
  profileSkillChipEditable, profilePwCard,
  profileUnsavedBanner, profileUnsavedBannerInner, profileUnsavedBannerText, profileUnsavedBannerActions,
  profileBannerBtnSm, profileLeaveOverlay, profileLeaveModal, profileLeaveModalHead,
  profileLeaveModalTitle, profileLeaveModalBody, profileLeaveModalActions,
  profileHiddenFileInput, profileSkillCount, profileSkillRemoveBtn, profileSkillAddRow,
  profileSkillAddInput, profileSkillAddBtn, profileSkillCancelBtn,
  profilePwHeader, profilePwTitle, profilePwFormStack, profilePwSubmitWrap,
} from './profileClasses.js';

const isStaff = (role) => role === 'ADMIN';
const isOrganizer = (role) => role === 'ORGANIZER';

// IUS departments shown as short-form options in the profile dropdown.
const DEPARTMENTS = [
  { value: 'CSE', label: 'CSE — Computer Science and Engineering' },
  { value: 'EEE', label: 'EEE — Electrical and Electronic Engineering' },
  { value: 'TE',  label: 'TE — Textile Engineering' },
  { value: 'BBA', label: 'BBA — Business Administration (Bachelor)' },
  { value: 'MBA', label: 'MBA — Business Administration (Master)' },
  { value: 'ENG', label: 'ENG — English' },
  { value: 'NS',  label: 'NS — Natural Science' },
];

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('general');
  const [editSection, setEditSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [savedForm, setSavedForm] = useState({});
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    usersService.getMyProfile()
      .then((r) => {
        setProfile(r.data);
        const initial = {
          fullName: r.data.full_name || '',
          phone: r.data.phone || '',
          bio: r.data.bio || '',
          studentId: r.data.student_id || '',
          batch: r.data.batch || '',
          section: r.data.section || '',
          department: r.data.department || '',
          skills: r.data.skills || [],
        };
        setForm(initial);
        setSavedForm(initial);
      })
      .catch(() => useToastStore.getState().error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Skill add/remove (free-form, volunteer-controlled)
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const exists = (form.skills || []).some((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      useToastStore.getState().error('You already have that skill.');
      return;
    }
    if (trimmed.length > 40) {
      useToastStore.getState().error('Skill must be 40 characters or fewer.');
      return;
    }
    setForm((f) => ({ ...f, skills: [...(f.skills || []), trimmed] }));
    setSkillInput('');
    setAddingSkill(false);
  };

  const removeSkill = (s) => {
    setForm((f) => ({ ...f, skills: (f.skills || []).filter((x) => x !== s) }));
  };

  const cancelAddSkill = () => {
    setAddingSkill(false);
    setSkillInput('');
  };

  const handleSaveProfile = useCallback(async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await usersService.updateMyProfile(form);
      setProfile(res.data);
      await fetchMe();
      setSavedForm({ ...form });
      useToastStore.getState().success('Profile updated!');
      setEditSection(null);
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  }, [form, fetchMe]);

  // Warn on browser close/refresh
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Intercept sidebar / back-button navigation when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => {
      e.preventDefault();
      history.pushState(null, '', window.location.href);
      setShowLeaveModal(true);
    };
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isDirty]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { useToastStore.getState().error('Image must be under 5 MB.'); return; }
    try {
      await usersService.uploadPhoto(file);
      useToastStore.getState().success('Photo updated!');
      await fetchMe();
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Upload failed.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { useToastStore.getState().error('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirm) { useToastStore.getState().error('Passwords do not match.'); return; }
    setPwLoading(true);
    try {
      await authService.changePassword(pwForm.oldPassword, pwForm.newPassword);
      useToastStore.getState().success('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return (
    <>
      <Topbar />
      <div className={pageContent}><PageSpinner /></div>
    </>
  );

  const role = user?.role || '';
  const name = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || profile?.email || '';
  const staff = isStaff(role);
  const organizer = isOrganizer(role);

  const toggleEdit = (section) => setEditSection((s) => (s === section ? null : section));
  const val = (v) => v || <span className={profileMuted}>—</span>;

  return (
    <>
      <Topbar />

      {/* Unsaved changes banner */}
      {isDirty && (
        <div className={profileUnsavedBanner}>
          <div className={profileUnsavedBannerInner}>
            <Icon name="warning" size={15} color="var(--amber-400)" />
            <span className={profileUnsavedBannerText}>
              You have unsaved changes
            </span>
          </div>
          <div className={profileUnsavedBannerActions}>
            <button
              type="button"
              className={`${btnGhostSm} ${profileBannerBtnSm}`}
              onClick={() => { setForm({ ...savedForm }); setEditSection(null); }}
            >
              Discard
            </button>
            <button
              type="button"
              className={`${btnPrimarySm} ${profileBannerBtnSm}`}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? <Spinner size="sm" /> : 'Save now'}
            </button>
          </div>
        </div>
      )}

      {/* Leave confirmation modal */}
      {showLeaveModal && (
        <div className={profileLeaveOverlay}>
          <div className={profileLeaveModal}>
            <div className={profileLeaveModalHead}>
              <Icon name="warning" size={20} color="var(--amber-400)" />
              <span className={profileLeaveModalTitle}>Unsaved changes</span>
            </div>
            <p className={profileLeaveModalBody}>
              You have unsaved changes. If you leave now your changes will be lost.
            </p>
            <div className={profileLeaveModalActions}>
              <button type="button" className={btnGhostSm} onClick={() => setShowLeaveModal(false)}>Stay</button>
              <button
                type="button"
                className={btnDangerSm}
                onClick={() => {
                  setSavedForm({ ...form });
                  setShowLeaveModal(false);
                  history.back();
                }}
              >
                Leave anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={pageContent}>
        <div className={profileShell}>

          <div className={profileCard}>
            {/* Cover banner */}
            <div className={profileCover}>
              <div className={`${profileCoverPattern} ${profileCoverPatternBg}`} aria-hidden="true" />
            </div>

            {/* Hero */}
            <div className={profileHero}>
              <div className={profilePhotoWrap}>
                <Avatar name={name} src={profile?.photo_url} size="xl" />
                <label className={profilePhotoBtn} title="Upload photo">
                  <Icon name="camera" size={12} strokeWidth={2.2} color="#fff" />
                  <input type="file" accept="image/*" className={profileHiddenFileInput} onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className={profileHeroMeta}>
                <div className={profileHeroName}>{name}</div>
                <div className={profileHeroSub}>
                  <span className={profileHeroEmail}>{email}</span>
                  <Badge label={role} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={profileTabs}>
              {[
                { key: 'general', label: 'General' },
                { key: 'password', label: 'Password' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={profileTab(tab === t.key)}
                  onClick={() => { setTab(t.key); setEditSection(null); }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className={profileBody}>
              {tab === 'general' && (
                <form onSubmit={handleSaveProfile}>
                  <div className={profileGrid}>

                    {/* Contact info */}
                    <div className={profileSection}>
                      <div className={profileSectionHead}>
                        <div className={profileSectionTitle}>Contact info</div>
                        <button type="button" className={profileEditLink} onClick={() => toggleEdit('contact')}>
                          {editSection === 'contact' ? 'Done' : 'Edit'}
                        </button>
                      </div>
                      <div className={profileKv}>
                        <div className={profileKvRow}>
                          <div className={profileK}>Display name</div>
                          <div className={profileV}>
                            {editSection === 'contact'
                              ? <input name="fullName" className={inputField} value={form.fullName} onChange={handleChange} />
                              : val(form.fullName)}
                          </div>
                        </div>
                        <div className={profileKvRow}>
                          <div className={profileK}>Email address</div>
                          <div className={profileV}>{val(email)}</div>
                        </div>
                        <div className={profileKvRow}>
                          <div className={profileK}>Phone number</div>
                          <div className={profileV}>
                            {editSection === 'contact'
                              ? <input name="phone" className={inputField} placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} />
                              : val(form.phone)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal info — hidden for ADMIN */}
                    {!staff && (
                      <div className={profileSection}>
                        <div className={profileSectionHead}>
                          <div className={profileSectionTitle}>
                            {organizer ? 'Organization info' : 'Academic info'}
                          </div>
                          <button type="button" className={profileEditLink} onClick={() => toggleEdit('personal')}>
                            {editSection === 'personal' ? 'Done' : 'Edit'}
                          </button>
                        </div>
                        <div className={profileKv}>
                          {!organizer && (
                            <div className={profileKvRow}>
                              <div className={profileK}>Student ID</div>
                              <div className={profileV}>
                                {editSection === 'personal'
                                  ? <input name="studentId" className={inputField} value={form.studentId} onChange={handleChange} />
                                  : val(form.studentId)}
                              </div>
                            </div>
                          )}
                          <div className={profileKvRow}>
                            <div className={profileK}>Department</div>
                            <div className={profileV}>
                              {editSection === 'personal' ? (
                                <select
                                  name="department"
                                  className={inputSelect}
                                  value={form.department || ''}
                                  onChange={handleChange}
                                >
                                  <option value="">— Select department —</option>
                                  {DEPARTMENTS.map((d) => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                  ))}
                                  {form.department && !DEPARTMENTS.some((d) => d.value === form.department) && (
                                    <option value={form.department}>{form.department} (custom)</option>
                                  )}
                                </select>
                              ) : (
                                val(form.department)
                              )}
                            </div>
                          </div>
                          {!organizer && (
                            <>
                              <div className={profileKvRow}>
                                <div className={profileK}>Batch</div>
                                <div className={profileV}>
                                  {editSection === 'personal'
                                    ? <input name="batch" type="number" className={inputField} value={form.batch} onChange={handleChange} />
                                    : val(form.batch)}
                                </div>
                              </div>
                              <div className={profileKvRow}>
                                <div className={profileK}>Section</div>
                                <div className={profileV}>
                                  {editSection === 'personal'
                                    ? <input name="section" className={inputField} value={form.section} onChange={handleChange} />
                                    : val(form.section)}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* About */}
                    <div className={profileSection}>
                      <div className={profileSectionHead}>
                        <div className={profileSectionTitle}>About</div>
                        <button type="button" className={profileEditLink} onClick={() => toggleEdit('about')}>
                          {editSection === 'about' ? 'Done' : 'Edit'}
                        </button>
                      </div>
                      {editSection === 'about'
                        ? <textarea name="bio" className={textareaField} rows={4} value={form.bio} onChange={handleChange} />
                        : <div className={`${profileV} whitespace-pre-wrap leading-relaxed`}>{val(form.bio)}</div>}
                    </div>

                    {/* Skills — volunteers only, free-form */}
                    {role === 'VOLUNTEER' && (
                      <div className={profileSection}>
                        <div className={profileSectionHead}>
                          <div className={profileSectionTitle}>Skills</div>
                          <span className={profileSkillCount}>
                            {(form.skills || []).length} added
                          </span>
                        </div>
                        <div className={profileSkillChips}>
                          {(form.skills || []).map((s) => (
                            <span
                              key={s}
                              className={profileSkillChipActive}
                            >
                              {s}
                              <button
                                type="button"
                                onClick={() => removeSkill(s)}
                                aria-label={`Remove ${s}`}
                                className={profileSkillRemoveBtn}
                              >
                                <Icon name="x" size={11} />
                              </button>
                            </span>
                          ))}

                          {addingSkill ? (
                            <span className={profileSkillAddRow}>
                              <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
                                  if (e.key === 'Escape') { e.preventDefault(); cancelAddSkill(); }
                                }}
                                autoFocus
                                placeholder="e.g. Public speaking"
                                maxLength={40}
                                className={profileSkillAddInput}
                              />
                              <button
                                type="button" onClick={addSkill}
                                className={`${btnPrimarySm} ${profileSkillAddBtn}`}
                              >Add</button>
                              <button
                                type="button" onClick={cancelAddSkill}
                                className={`${btnGhostSm} ${profileSkillCancelBtn}`}
                              >Cancel</button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAddingSkill(true)}
                              className={profileSkillChipEditable}
                            >
                              <Icon name="plus" size={12} /> Add skill
                            </button>
                          )}
                        </div>

                      </div>
                    )}

                  </div>

                </form>
              )}

              {tab === 'password' && (
                <div className={profilePwCard}>
                  <div className={profilePwHeader}>
                    <Icon name="lock" size={16} color="var(--accent)" />
                    <span className={profilePwTitle}>Change password</span>
                  </div>
                  <form onSubmit={handleChangePassword}>
                    <div className={profilePwFormStack}>
                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="oldPassword">Current password</label>
                        <input id="oldPassword" type="password" className={inputField} value={pwForm.oldPassword} onChange={(e) => setPwForm((f) => ({ ...f, oldPassword: e.target.value }))} required />
                      </div>
                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="newPassword">New password</label>
                        <input id="newPassword" type="password" className={inputField} placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} required />
                      </div>
                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="confirm">Confirm new password</label>
                        <input id="confirm" type="password" className={inputField} value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} required />
                      </div>
                      <div className={profilePwSubmitWrap}>
                        <button type="submit" className={btnPrimaryFull} disabled={pwLoading}>
                          {pwLoading ? <Spinner size="sm" /> : 'Update password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
