import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { usersService } from '../../services/users.service.js';
import { feedbackService } from '../../services/feedback.service.js';
import useAuthStore from '../../stores/useAuthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { contentGrid, pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  adminPanel,
  adminPanelActions,
  adminPanelDesc,
  adminPanelHeader,
  adminPanelTitle,
  badgeBase,
  badgeColor,
  btnSecondarySm,
  btnSuccessSm,
  card,
  cardProfileBadges,
  cardProfileEmail,
  cardProfileHeader,
  cardProfileMeta,
  cardProfileName,
  cardSection,
  cardSectionChips,
  cardSectionLabel,
  cardSectionLabelSpaced,
  cardSectionText,
  cardTitleMb,
  infoRow,
  infoRowLabel,
  infoRowValue,
  inputSelectFlex,
  pageToolbar,
  selfRoleNote,
} from '../../components/ui/componentClasses.js';

const ROLES = ['ATTENDEE', 'VOLUNTEER', 'ORGANIZER', 'ADMIN'];

function InfoRow({ label, value }) {
  return (
    <div className={infoRow}>
      <span className={infoRowLabel}>{label}</span>
      <span className={infoRowValue}>{value || '—'}</span>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState(null); // role we're about to confirm
  const [changingRole, setChangingRole] = useState(false);
  const [ratings, setRatings] = useState(null); // { average, count }
  const { user: me } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();
  const isAdmin = me?.role === 'ADMIN';
  const isSelf = me?.id === id;

  useEffect(() => {
    usersService.getUserById(id)
      .then((r) => {
        const u = r.data;
        setUser(u);
        // Fetch ratings if relevant
        const fetcher = u.role === 'VOLUNTEER' ? feedbackService.getVolunteerRatings(id)
                      : (u.role === 'ORGANIZER' || u.role === 'ADMIN') ? feedbackService.getOrganizerRatings(id)
                      : null;
        if (fetcher) {
          fetcher.then((rr) => {
            const list = Array.isArray(rr.data) ? rr.data : rr.data?.ratings || [];
            if (list.length > 0) {
              const avg = list.reduce((acc, r) => acc + (r.rating || r.score || 0), 0) / list.length;
              setRatings({ average: avg, count: list.length, list });
            } else {
              setRatings({ average: 0, count: 0, list: [] });
            }
          }).catch(() => { /* ratings missing — no big deal */ });
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || 'User not found.');
        navigate('/users');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  const handleApprove = async () => {
    try {
      await usersService.approveOrganizer(id);
      toast.success('Organizer approved!');
      setUser((u) => ({ ...u, is_approved: true }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to approve.');
    }
  };

  const handleToggleActive = async () => {
    try {
      await usersService.toggleActive(id, !user.is_active);
      toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'}.`);
      setUser((u) => ({ ...u, is_active: !u.is_active }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRole) return;
    setChangingRole(true);
    try {
      const r = await usersService.changeRole(id, pendingRole);
      toast.success(`Role changed to ${pendingRole.replace('_', ' ')}.`);
      setUser((u) => ({ ...u, role: r.data.role, is_approved: r.data.is_approved }));
      setPendingRole(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change role.');
    } finally {
      setChangingRole(false);
    }
  };

  if (loading) return (
    <>
      <Topbar />
      <div className={pageContent}><PageSpinner /></div>
    </>
  );

  if (!user) return null;

  const name = user.full_name || user.email?.split('@')[0] || 'Unknown';

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>{name}</div>
            <div className={pageSubtitle}>User details and account info</div>
          </div>
        </div>
        <div className={pageToolbar}>
          <button type="button" className={btnSecondarySm} onClick={() => navigate('/users')}>← Back</button>
          {user.role === 'ORGANIZER' && !user.is_approved && (
            <button type="button" className={btnSuccessSm} onClick={handleApprove}>Approve Organizer</button>
          )}
          <button
            type="button"
            className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`}
            onClick={handleToggleActive}
          >{user.is_active ? 'Deactivate' : 'Activate'}</button>
        </div>

        <div className={contentGrid}>
          {/* Profile Card */}
          <div className={card}>
            <div className={cardProfileHeader}>
              <Avatar name={name} src={user.photo_url} size="xl" />
              <div className={cardProfileMeta}>
                <div className={cardProfileName}>{name}</div>
                <div className={cardProfileEmail}>{user.email}</div>
                <div className={cardProfileBadges}>
                  <Badge label={user.role} />
                  <Badge label={user.is_active ? 'active' : 'inactive'} />
                  {ratings && ratings.count > 0 && (
                    <StarRating value={ratings.average} count={ratings.count} size={14} />
                  )}
                </div>
              </div>
            </div>
            <InfoRow label="Student ID" value={user.student_id} />
            <InfoRow label="Department" value={user.department} />
            <InfoRow label="Batch" value={user.batch} />
            <InfoRow label="Section" value={user.section} />
            <InfoRow label="Phone" value={user.phone} />
          </div>

          {/* Account Card */}
          <div className={card}>
            <div className={cardTitleMb}>Account Info</div>
            <InfoRow label="Role" value={<Badge label={user.role} />} />
            <InfoRow label="Email verified" value={<Badge label={user.is_email_verified ? 'Verified' : 'Unverified'} color={user.is_email_verified ? 'green' : 'amber'} />} />
            <InfoRow label="Approved" value={<Badge label={user.is_approved ? 'Approved' : 'Pending'} color={user.is_approved ? 'green' : 'amber'} />} />
            <InfoRow label="Active" value={<Badge label={user.is_active ? 'Active' : 'Inactive'} color={user.is_active ? 'green' : 'red'} />} />
            <InfoRow label="Member since" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'} />

            {/* Admin: change role */}
            {isAdmin && !isSelf && (
              <div className={adminPanel}>
                <div className={adminPanelHeader}>
                  <Icon name="shield" size={16} color="var(--purple-400)" />
                  <div className={adminPanelTitle}>Change Role</div>
                </div>
                <div className={adminPanelDesc}>
                  Promote or demote this user. Promoting to Organizer auto-approves; promoting to Admin also marks email verified.
                </div>
                <div className={adminPanelActions}>
                  <select
                    className={inputSelectFlex}
                    value={user.role}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (next === user.role) return;
                      setPendingRole(next);
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {isSelf && isAdmin && (
              <div className={selfRoleNote}>
                You can't change your own role.
              </div>
            )}
            {user.bio && (
              <div className={cardSection}>
                <div className={cardSectionLabel}>Bio</div>
                <p className={cardSectionText}>{user.bio}</p>
              </div>
            )}
            {user.skills?.length > 0 && (
              <div className={cardSection}>
                <div className={cardSectionLabelSpaced}>Skills</div>
                <div className={cardSectionChips}>
                  {user.skills.map((s) => (
                    <span key={s} className={`${badgeBase} ${badgeColor('cyan')}`}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ConfirmModal
          isOpen={!!pendingRole}
          onClose={() => !changingRole && setPendingRole(null)}
          onConfirm={handleConfirmRoleChange}
          title="Change role"
          message={
            pendingRole
              ? `Change ${name}'s role from ${user.role.replace('_', ' ')} to ${pendingRole.replace('_', ' ')}? They'll get the new permissions immediately.`
              : ''
          }
          confirmText={changingRole ? 'Changing…' : 'Change Role'}
          danger={pendingRole === 'ADMIN'}
        />
      </div>
    </>
  );
}
