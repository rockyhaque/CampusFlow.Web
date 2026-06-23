import { useEffect, useState, useCallback } from 'react';
import Badge from '../../../components/ui/Badge.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { PageSpinner, Spinner } from '../../../components/ui/Spinner.jsx';
import useToastStore from '../../../stores/useToastStore.js';
import Icon from '../../../components/ui/Icon.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';

import { volunteersService } from '../../../services/volunteers.service.js';
import { feedbackService } from '../../../services/feedback.service.js';
import RatingModal from '../../../components/ui/RatingModal.jsx';
import { fmtDate } from './constants.js';
import {
  btnDangerSm, btnPrimarySm, btnSecondarySm, btnSuccessSm, card, cardHeader, cardSubtitle, cardTitle,
  inputField, inputLabel, inputSelect, inputWrap,
  tableWrap, tdMuted, tdPrimary, textMuted13, textareaField,
} from '../../../components/ui/componentClasses.js';

export default function VolunteersTab({ eventId, eventStatus }) {
  const [needs, setNeeds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingNeeds, setLoadingNeeds] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [needModal, setNeedModal] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [needForm, setNeedForm] = useState({ roleName: '', headcount: '', description: '' });
  const [savingNeed, setSavingNeed] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [ratingVolunteer, setRatingVolunteer] = useState(null); // { volunteerId, volunteerName }
  const [hoursDraft, setHoursDraft] = useState({});         // { [appId]: '6.5' }
  const [editingHoursIds, setEditingHoursIds] = useState(new Set()); // app ids in edit mode
  const [savingHoursId, setSavingHoursId] = useState(null);

  const loadNeeds = useCallback(() => {
    setLoadingNeeds(true);
    volunteersService.getNeedsByEvent(eventId)
      .then((r) => setNeeds(r.data || []))
      .catch(() => useToastStore.getState().error('Failed to load volunteer needs.'))
      .finally(() => setLoadingNeeds(false));
  }, [eventId]);

  const loadApps = useCallback(() => {
    setLoadingApps(true);
    volunteersService.getApplications(eventId)
      .then((r) => setApplications(r.data || []))
      .catch(() => useToastStore.getState().error('Failed to load applications.'))
      .finally(() => setLoadingApps(false));
  }, [eventId]);

  useEffect(() => { loadNeeds(); loadApps(); }, [loadNeeds, loadApps]);

  const openAddNeedModal = () => {
    setEditingNeed(null);
    setNeedForm({ roleName: '', headcount: '', description: '' });
    setNeedModal(true);
  };

  const openEditNeedModal = (n) => {
    setEditingNeed(n);
    setNeedForm({ roleName: n.role_name, headcount: String(n.headcount ?? ''), description: n.description || '' });
    setNeedModal(true);
  };

  const handleSaveNeed = async (e) => {
    e.preventDefault();
    if (!needForm.roleName) { useToastStore.getState().error('Role name is required.'); return; }
    setSavingNeed(true);
    const payload = {
      roleName: needForm.roleName,
      headcount: needForm.headcount ? parseInt(needForm.headcount) : undefined,
      description: needForm.description || undefined,
    };
    try {
      if (editingNeed) {
        await volunteersService.updateNeed(editingNeed.id, payload);
        useToastStore.getState().success('Volunteer role updated.');
      } else {
        await volunteersService.createNeed(eventId, payload);
        useToastStore.getState().success('Volunteer role created.');
      }
      setNeedModal(false);
      setEditingNeed(null);
      setNeedForm({ roleName: '', headcount: '', description: '' });
      loadNeeds();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to save role.');
    } finally { setSavingNeed(false); }
  };

  const handleDeleteNeed = async (id) => {
    try {
      await volunteersService.deleteNeed(id);
      useToastStore.getState().success('Role deleted.');
      loadNeeds();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to delete.');
    }
  };

  const handleReview = async (appId, status) => {
    try {
      await volunteersService.reviewApplication(appId, { status });
      useToastStore.getState().success(`Application ${status}.`);
      loadApps();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Review failed.');
    }
  };

  // Open / close edit-mode for a row's hours
  const openHoursEdit = (app) => {
    setEditingHoursIds((s) => new Set(s).add(app.id));
    setHoursDraft((d) => ({
      ...d,
      [app.id]: app.hours_logged > 0 ? String(app.hours_logged) : '',
    }));
  };
  const cancelHoursEdit = (app) => {
    setEditingHoursIds((s) => { const n = new Set(s); n.delete(app.id); return n; });
    setHoursDraft((d) => { const n = { ...d }; delete n[app.id]; return n; });
  };
  const closeHoursEdit = (appId) => {
    setEditingHoursIds((s) => { const n = new Set(s); n.delete(appId); return n; });
    setHoursDraft((d) => { const n = { ...d }; delete n[appId]; return n; });
  };

  // Dirty = currently in edit mode AND the draft differs from the saved value.
  const isHoursDirty = (app) => {
    if (!editingHoursIds.has(app.id)) return false;
    const drafted = parseFloat(hoursDraft[app.id]);
    const saved = parseFloat(app.hours_logged) || 0;
    if (!Number.isFinite(drafted)) {
      return saved > 0 && hoursDraft[app.id] !== String(saved);
    }
    return drafted !== saved;
  };

  const handleSaveHours = async (app) => {
    const raw = hoursDraft[app.id] ?? String(app.hours_logged ?? '');
    const hours = parseFloat(raw);
    if (!Number.isFinite(hours) || hours < 0) {
      useToastStore.getState().error('Enter a valid number of hours.');
      return;
    }
    setSavingHoursId(app.id);
    try {
      await volunteersService.setVolunteerHours(eventId, app.volunteer_id, hours);
      useToastStore.getState().success(`Hours saved: ${hours}h`);
      closeHoursEdit(app.id);
      loadApps();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to save hours.');
    } finally {
      setSavingHoursId(null);
    }
  };

  // Save every row currently in edit mode that has a dirty change.
  const [bulkSavingHours, setBulkSavingHours] = useState(false);
  const handleSaveAllHours = async () => {
    const dirty = applications.filter(isHoursDirty);
    if (dirty.length === 0) return;
    setBulkSavingHours(true);
    let ok = 0, fail = 0;
    for (const app of dirty) {
      const hours = parseFloat(hoursDraft[app.id]);
      if (!Number.isFinite(hours) || hours < 0) { fail++; continue; }
      try {
        await volunteersService.setVolunteerHours(eventId, app.volunteer_id, hours);
        ok++;
      } catch {
        fail++;
      }
    }
    setEditingHoursIds(new Set());
    setHoursDraft({});
    setBulkSavingHours(false);
    loadApps();
    if (fail === 0) useToastStore.getState().success(`Saved hours for ${ok} volunteer${ok === 1 ? '' : 's'}.`);
    else useToastStore.getState().error(`${ok} saved, ${fail} failed.`);
  };

  const filteredApps = filterStatus
    ? applications.filter((a) => a.status === filterStatus)
    : applications;
  const dirtyHoursCount = applications.filter(isHoursDirty).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Needs */}
      <div className={card}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Volunteer Roles</div>
            <div className={cardSubtitle}>Define the roles you need volunteers for</div>
          </div>
          <button className={btnPrimarySm} onClick={openAddNeedModal}>+ Add Role</button>
        </div>

        {loadingNeeds ? <PageSpinner /> : needs.length === 0 ? (
          <EmptyState
            icon="users"
            title="No volunteer roles yet"
            description="Add roles to accept volunteer applications."
          />
        ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr><th>Role</th><th>Slots</th><th>Filled</th><th>Description</th><th>Action</th></tr>
              </thead>
              <tbody>
                {needs.map((n) => (
                  <tr key={n.id}>
                    <td className={tdPrimary}>{n.role_name}</td>
                    <td>{n.headcount ?? 'Unlimited'}</td>
                    <td>{n.filled_count ?? 0}</td>
                    <td className={tdMuted}>{n.description || '—'}</td>
                    <td>
                      <div className="flex gap-1.5">
                        <button className={btnSecondarySm} onClick={() => openEditNeedModal(n)}>Edit</button>
                        <button className={btnDangerSm} onClick={() => handleDeleteNeed(n.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Applications */}
      <div className={card}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Applications</div>
            <div className={cardSubtitle}>{applications.length} total</div>
          </div>
          <div className="flex items-center gap-2.5">
            {dirtyHoursCount > 0 && (
              <button
                className={btnPrimarySm}
                onClick={handleSaveAllHours}
                disabled={bulkSavingHours}
              >
                {bulkSavingHours ? 'Saving…' : `Save hours (${dirtyHoursCount})`}
              </button>
            )}
            <select
              className={`${inputSelect} h-9 w-[140px] text-[13px]`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loadingApps ? <PageSpinner /> : filteredApps.length === 0 ? (
          <EmptyState
            icon="clipboard"
            title="No applications"
            description={filterStatus ? 'None with this status.' : 'No one has applied yet.'}
          />
        ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr><th>Volunteer</th><th>Role</th><th>Avg. Rating</th><th>This Event</th><th>Total Events</th><th>Status</th><th>Applied</th><th>Hours</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className={tdPrimary}>
                        {app.full_name || app.volunteer_name || app.email || app.volunteer_email || '—'}
                      </div>
                      <div className="text-xs text-muted">{app.email || app.volunteer_email}</div>
                    </td>
                    <td className={tdMuted}>{app.role_name || '—'}</td>
                    <td className="text-[13px]">
                      {app.total_ratings > 0 ? (
                        <div className="flex items-center gap-1">
                          <Icon name="starFilled" size={12} className="text-amber-500" />
                          <strong className="font-semibold text-primary">{Number(app.avg_rating).toFixed(1)}</strong>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">No ratings</span>
                      )}
                    </td>
                    <td className="text-[13px]">
                      {app.event_rating_count > 0 ? (
                        <div className="flex items-center gap-1">
                          <Icon name="starFilled" size={12} className="text-amber-500" />
                          <strong className="font-semibold text-primary">{Number(app.event_rating).toFixed(1)}</strong>
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted">Not rated</span>
                      )}
                    </td>
                    <td className={textMuted13}>{app.events_count || 0}</td>
                    <td>
                      <Badge label={app.status} color={app.status === 'approved' ? 'green' : app.status === 'rejected' ? 'red' : 'amber'} />
                    </td>
                    <td className={textMuted13}>{fmtDate(app.applied_at || app.created_at)}</td>
                    <td>
                      {app.status === 'approved' && eventStatus === 'completed' ? (
                        editingHoursIds.has(app.id) ? (
                          // ── EDIT mode ─────────────────────────────────────
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              step="0.25"
                              placeholder="e.g. 6.5"
                              value={hoursDraft[app.id] ?? ''}
                              onChange={(e) => setHoursDraft((d) => ({ ...d, [app.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') { e.preventDefault(); handleSaveHours(app); }
                                if (e.key === 'Escape') { e.preventDefault(); cancelHoursEdit(app); }
                              }}
                              autoFocus
                              className={`${inputField} w-20 px-2 py-1 text-xs`}
                            />
                            <button
                              className={`${btnPrimarySm} inline-flex items-center justify-center px-2 py-1`}
                              onClick={() => handleSaveHours(app)}
                              disabled={savingHoursId === app.id || !isHoursDirty(app)}
                              aria-label="Save hours"
                              title="Save"
                            >
                              {savingHoursId === app.id ? '…' : <Icon name="check" size={13} />}
                            </button>
                            <button
                              className={`${btnSecondarySm} inline-flex items-center justify-center px-2 py-1`}
                              onClick={() => cancelHoursEdit(app)}
                              aria-label="Cancel"
                              title="Cancel"
                            >
                              <Icon name="x" size={13} />
                            </button>
                          </div>
                        ) : (
                          // ── READ-ONLY mode ────────────────────────────────
                          <div className="flex items-center gap-2">
                            <span className={`inline-block min-w-14 text-right text-[13px] font-semibold tabular-nums ${app.hours_logged > 0 ? 'text-primary' : 'text-muted'}`}>
                              {app.hours_logged > 0 ? `${app.hours_logged} h` : '—'}
                            </span>
                            <button
                              className={`${btnSecondarySm} inline-flex items-center justify-center px-2 py-1`}
                              onClick={() => openHoursEdit(app)}
                              aria-label={app.hours_logged > 0 ? 'Edit hours' : 'Set hours'}
                              title={app.hours_logged > 0 ? 'Edit hours' : 'Set hours'}
                            >
                              <Icon name="edit" size={13} />
                            </button>
                          </div>
                        )
                      ) : app.status === 'approved' ? (
                        <span className="text-xs text-muted">
                          {app.hours_logged > 0 ? `${app.hours_logged} h` : 'after event ends'}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5">
                        {app.status === 'pending' && (
                          <>
                            <button className={btnSuccessSm} onClick={() => handleReview(app.id, 'approved')}>Approve</button>
                            <button className={btnDangerSm} onClick={() => handleReview(app.id, 'rejected')}>Reject</button>
                          </>
                        )}
                        {app.status === 'approved' && eventStatus === 'completed' && (
                          <button
                            className={btnSuccessSm}
                            onClick={() => setRatingVolunteer({
                              volunteerId: app.volunteer_id,
                              volunteerName: app.full_name || app.email,
                            })}
                          >
                            <Icon name="star" size={13} /> Rate
                          </button>
                        )}
                        {app.status === 'rejected' && (
                          <span className="text-xs text-muted">Rejected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Need modal */}
      <Modal
        isOpen={needModal}
        onClose={() => setNeedModal(false)}
        title={editingNeed ? 'Edit Volunteer Role' : 'Add Volunteer Role'}
        footer={
          <>
            <button className={btnSecondarySm} onClick={() => setNeedModal(false)}>Cancel</button>
            <button className={btnPrimarySm} onClick={handleSaveNeed} disabled={savingNeed}>
              {savingNeed ? <Spinner size="sm" /> : editingNeed ? 'Save Changes' : 'Create Role'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          <div className={inputWrap}>
            <label className={inputLabel}>Role Name *</label>
            <input className={inputField} placeholder="e.g. Registration Desk" value={needForm.roleName}
              onChange={(e) => setNeedForm((f) => ({ ...f, roleName: e.target.value }))} />
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Headcount (slots available)</label>
            <input type="number" min="1" className={inputField} placeholder="Leave blank for unlimited"
              value={needForm.headcount} onChange={(e) => setNeedForm((f) => ({ ...f, headcount: e.target.value }))} />
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Description</label>
            <textarea className={textareaField} rows={3} placeholder="What will volunteers do in this role?"
              value={needForm.description} onChange={(e) => setNeedForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {ratingVolunteer && (
        <RatingModal
          title={`Rate ${ratingVolunteer.volunteerName}`}
          subtitle="How was their performance as a volunteer for this event?"
          onClose={() => setRatingVolunteer(null)}
          onSubmit={(payload) => feedbackService.rateVolunteer(eventId, ratingVolunteer.volunteerId, payload)}
          submitLabel="Submit Rating"
        />
      )}
    </div>
  );
}
