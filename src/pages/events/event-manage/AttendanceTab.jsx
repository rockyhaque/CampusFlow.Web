import { useEffect, useState, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import Badge from '../../../components/ui/Badge.jsx';
import { ConfirmModal } from '../../../components/ui/Modal.jsx';
import { PageSpinner, Spinner } from '../../../components/ui/Spinner.jsx';
import { ticketsService } from '../../../services/tickets.service.js';
import { volunteersService } from '../../../services/volunteers.service.js';
import { attendanceService } from '../../../services/attendance.service.js';
import useToastStore from '../../../stores/useToastStore.js';
import Icon from '../../../components/ui/Icon.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import SearchInput from '../../../components/ui/SearchInput.jsx';
import QrScannerModal from './QrScannerModal.jsx';
import AttendeeDetailModal from './AttendeeDetailModal.jsx';
import { filterBar } from '../../../components/layout/layoutClasses.js';
import {
  btnPrimary, btnPrimarySm, btnSecondarySm, btnSuccessSm, card, cardHeader, cardSubtitle, cardTitle,
  cardSubtitleMb, cardTitleMbTight, inputField, inputLabel,
  inputSelect, inputWrap, inputSelectW160, statCard, statCardBody, statCardIcon, statCardLabel, statCardValue,
  tableRowClickable, tableWrap, tdPrimary, textMuted13,
} from '../../../components/ui/componentClasses.js';

export default function AttendanceTab({ eventId }) {
  const [records, setRecords] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualForm, setManualForm] = useState({ userId: '', userType: 'attendee' });
  const [saving, setSaving] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [lastScan, setLastScan] = useState(null); // { ok: bool, message: string }
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [detailRecord, setDetailRecord] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { kind: 'check_in' | 'check_out', person }

  // Roster filters / search / sort
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | not_arrived | checked_in | checked_out
  const [typeFilter, setTypeFilter] = useState('all'); // all | attendee | volunteer
  const [sortBy, setSortBy] = useState('status'); // status | name | check_in

  const load = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      attendanceService.getEventAttendance(eventId),
      ticketsService.getEventTickets(eventId),
      volunteersService.getApplications(eventId),
    ]).then(([attRes, tixRes, appsRes]) => {
      if (attRes.status === 'fulfilled') setRecords(attRes.value.data || []);
      if (tixRes.status === 'fulfilled') setTickets(tixRes.value.data || []);
      if (appsRes.status === 'fulfilled') {
        // Only approved volunteer applications count as expected
        const apps = (appsRes.value.data || []).filter((a) => a.status === 'approved');
        setVolunteerApps(apps);
      }
      if (attRes.status === 'rejected') useToastStore.getState().error('Failed to load attendance.');
    }).finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => { load(); }, [load]);

  // Build the unified roster: every expected person + their check-in status
  const roster = (() => {
    const byUserId = new Map();

    // 1. Add ticket buyers (attendees) — only confirmed tickets
    tickets
      .filter((t) => (t.payment_status || t.status) === 'confirmed')
      .forEach((t) => {
        if (!t.user_id || byUserId.has(t.user_id)) return;
        byUserId.set(t.user_id, {
          user_id: t.user_id,
          full_name: t.full_name || t.user_name,
          email: t.email || t.user_email,
          photo_url: t.photo_url,
          user_type: 'attendee',
          extra: t.ticket_type_name ? `Ticket · ${t.ticket_type_name}` : 'Ticket holder',
          ticket_id: t.id,
          short_code: t.short_code,
          expires_at: t.expires_at,
          ticket_type_name: t.ticket_type_name,
          payment_status: t.payment_status,
        });
      });

    // 2. Add approved volunteers
    volunteerApps.forEach((a) => {
      if (!a.volunteer_id || byUserId.has(a.volunteer_id)) return;
      byUserId.set(a.volunteer_id, {
        user_id: a.volunteer_id,
        full_name: a.full_name || a.volunteer_name,
        email: a.email || a.volunteer_email,
        photo_url: a.photo_url,
        user_type: 'volunteer',
        extra: a.role_name ? `Role · ${a.role_name}` : 'Volunteer',
      });
    });

    // 3. Overlay attendance status
    records.forEach((r) => {
      const checkIn = r.check_in_time || r.checked_in_at;
      const checkOut = r.check_out_time || r.checked_out_at;
      const existing = byUserId.get(r.user_id) || {
        user_id: r.user_id,
        full_name: r.full_name || r.user_name,
        email: r.email || r.user_email,
        photo_url: r.photo_url,
        user_type: r.user_type || 'attendee',
        extra: r.user_type === 'volunteer' ? 'Volunteer' : 'Walk-in',
      };
      byUserId.set(r.user_id, {
        ...existing,
        attendance_id: r.id,
        check_in_time: checkIn,
        check_out_time: checkOut,
        notes: r.notes,
        ticket_id: existing.ticket_id || r.ticket_id,
        short_code: existing.short_code,
        expires_at: existing.expires_at,
        ticket_type_name: existing.ticket_type_name,
        payment_status: existing.payment_status,
        student_id: r.student_id || existing.student_id,
        batch: r.batch || existing.batch,
        section: r.section || existing.section,
        department: r.department || existing.department,
        skills: r.skills || existing.skills,
      });
    });

    return Array.from(byUserId.values());
  })();

  const getStatus = (p) =>
    !p.check_in_time ? 'not_arrived' : !p.check_out_time ? 'checked_in' : 'checked_out';

  // Base for stats: apply search + type, but NOT status (so the status breakdown
  // stays meaningful — picking "Checked out" doesn't zero out the other cards).
  const matchesScope = (p) => {
    if (typeFilter !== 'all' && p.user_type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${p.full_name || ''} ${p.email || ''} ${p.extra || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const scoped = roster.filter(matchesScope);

  const filtered = scoped
    .filter((p) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'ever_checked_in') return !!p.check_in_time;
      return getStatus(p) === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.full_name || a.email || '').localeCompare(b.full_name || b.email || '');
      if (sortBy === 'check_in') {
        const at = a.check_in_time ? new Date(a.check_in_time).getTime() : Infinity;
        const bt = b.check_in_time ? new Date(b.check_in_time).getTime() : Infinity;
        return at - bt;
      }
      // status: not_arrived first, then checked_in, then checked_out
      const order = { not_arrived: 0, checked_in: 1, checked_out: 2 };
      return order[getStatus(a)] - order[getStatus(b)];
    });

  const counts = {
    total: scoped.length,
    not_arrived: scoped.filter((p) => getStatus(p) === 'not_arrived').length,
    checked_in: scoped.filter((p) => getStatus(p) === 'checked_in').length,
    checked_out: scoped.filter((p) => getStatus(p) === 'checked_out').length,
    total_check_ins: scoped.filter((p) => p.check_in_time).length, // anyone who has ever checked in
  };

  const handleQuickCheckIn = async (p) => {
    try {
      await attendanceService.checkInManual(eventId, p.user_id, p.user_type);
      useToastStore.getState().success(`${p.full_name || p.email} checked in.`);
      load();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Check-in failed.');
    }
  };

  const handleQrScan = async (decodedText) => {
    try {
      await attendanceService.checkInByQR(decodedText);
      setLastScan({ ok: true, message: 'Checked in successfully' });
      useToastStore.getState().success('Check-in successful.');
      load();
    } catch (e) {
      setLastScan({ ok: false, message: e.response?.data?.message || 'Invalid or already-used QR' });
    }
  };

  const decodeQrFromImage = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Try both orientations — jsqr can be picky about inversion on dark-background QRs
    const code =
      jsQR(data, width, height, { inversionAttempts: 'attemptBoth' }) ||
      jsQR(data, width, height, { inversionAttempts: 'invertFirst' });
    return code?.data || null;
  };

  const handleUploadQr = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setLastScan({ ok: false, message: 'Please select an image file (PNG, JPG, WebP).' });
      return;
    }
    setUploading(true);
    setLastScan(null);

    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('Failed to load image'));
        i.src = objectUrl;
      });

      const decoded = decodeQrFromImage(img);
      if (decoded) {
        await handleQrScan(decoded);
      } else {
        setLastScan({
          ok: false,
          message: 'No QR code found. Make sure the QR fills most of the frame and is not rotated or blurry.',
        });
      }
    } catch (err) {
      setLastScan({ ok: false, message: err?.message || 'Could not read the image file.' });
    } finally {
      URL.revokeObjectURL(objectUrl);
      setUploading(false);
    }
  };

  // Resolve an identifier (UUID, email, or short ticket ID) to a user_id
  // by searching the already-loaded roster. Returns { ok, user, matches } where
  // `matches` is the list of candidates if ambiguous.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const resolveIdentifier = (raw) => {
    const q = (raw || '').trim();
    if (!q) return { ok: false, error: 'Enter an email, ticket ID, or user UUID.' };

    // Direct UUID — could be a user_id or a ticket_id
    if (UUID_RE.test(q)) {
      const byUser = roster.find((p) => p.user_id?.toLowerCase() === q.toLowerCase());
      if (byUser) return { ok: true, user: byUser };
      const byTicket = roster.find((p) => p.ticket_id?.toLowerCase() === q.toLowerCase());
      if (byTicket) return { ok: true, user: byTicket };
      // Not in roster — assume it's a user_id and let the API decide
      return { ok: true, user: { user_id: q, full_name: null, email: q, user_type: manualForm.userType } };
    }

    // Email match
    if (q.includes('@')) {
      const matches = roster.filter((p) => p.email?.toLowerCase() === q.toLowerCase());
      if (matches.length === 0) return { ok: false, error: `No ticket holder or volunteer with email "${q}" for this event.` };
      if (matches.length === 1) return { ok: true, user: matches[0] };
      return { ok: false, ambiguous: true, matches, error: `${matches.length} people share that email — pick one below.` };
    }

    // Short ticket ID prefix (e.g. "92bb7bcb")
    const prefix = q.toLowerCase();
    const matches = roster.filter(
      (p) =>
        p.ticket_id?.toLowerCase().startsWith(prefix) ||
        p.user_id?.toLowerCase().startsWith(prefix)
    );
    if (matches.length === 0) return { ok: false, error: `No match for "${q}". Try the full email or ticket UUID.` };
    if (matches.length === 1) return { ok: true, user: matches[0] };
    return { ok: false, ambiguous: true, matches, error: `${matches.length} matches — narrow it down.` };
  };

  const [resolveAmbig, setResolveAmbig] = useState(null); // { matches: [...] }

  const handleCheckIn = async (e) => {
    e.preventDefault();
    const raw = (manualForm.userId || '').trim();
    if (!raw) {
      useToastStore.getState().error('Enter an email, ticket code, or UUID.');
      return;
    }

    // Short ticket code (TKT-XXXXXXXX) — short-circuit to the dedicated endpoint.
    // No need to look it up in the roster — backend validates expiry, event match, etc.
    if (/^TKT-[A-Z0-9]+$/i.test(raw)) {
      setSaving(true);
      try {
        await attendanceService.checkInByShortCode(eventId, raw.toUpperCase());
        useToastStore.getState().success(`Checked in by ticket code ${raw.toUpperCase()}.`);
        setManualForm({ userId: '', userType: 'attendee' });
        load();
      } catch (err) {
        useToastStore.getState().error(err.response?.data?.message || 'Check-in failed.');
      } finally { setSaving(false); }
      return;
    }

    const r = resolveIdentifier(raw);
    if (!r.ok) {
      useToastStore.getState().error(r.error);
      if (r.ambiguous) setResolveAmbig({ matches: r.matches });
      return;
    }
    setResolveAmbig(null);
    // Inferred type from roster wins over the dropdown when we know it
    const userType = r.user.user_type || manualForm.userType;
    setSaving(true);
    try {
      await attendanceService.checkInManual(eventId, r.user.user_id, userType);
      useToastStore.getState().success(`Checked in ${r.user.full_name || r.user.email || r.user.user_id}.`);
      setManualForm({ userId: '', userType: 'attendee' });
      load();
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Check-in failed.');
    } finally { setSaving(false); }
  };

  const handleCheckOut = async (userId) => {
    try {
      await attendanceService.checkOut(eventId, userId);
      useToastStore.getState().success('Check-out recorded.');
      load();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Check-out failed.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Stats — clickable to filter by status. Reflect search + type filter. */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        {[
          { key: 'all',              label: 'Expected',        value: counts.total,           icon: 'users',        color: 'cyan'   },
          { key: 'not_arrived',      label: 'Not arrived',     value: counts.not_arrived,     icon: 'clock',        color: 'amber'  },
          { key: 'checked_in',       label: 'Currently in',    value: counts.checked_in,      icon: 'checkCircle',  color: 'green'  },
          { key: 'checked_out',      label: 'Checked out',     value: counts.checked_out,     icon: 'x',            color: 'slate'  },
          { key: 'ever_checked_in',  label: 'Total check-ins', value: counts.total_check_ins, icon: 'award',        color: 'purple' },
        ].map((s) => {
          const active = statusFilter === s.key;
          return (
            <div
              key={s.key}
              className={`${statCard} cursor-pointer transition-all duration-fast ${active ? 'border-accent shadow-[0_0_0_1px_var(--accent),0_0_12px_rgba(34,211,238,0.15)]' : ''}`}
              onClick={() => setStatusFilter(s.key)}
            >
              <div className={statCardIcon(s.color)}><Icon name={s.icon} size={20} /></div>
              <div className={statCardBody}>
                <div className={statCardValue}>{s.value}</div>
                <div className={statCardLabel}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR scanner */}
      <div className={`${card} border-cyan-400/25`}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Scan Ticket QR</div>
            <div className={cardSubtitle}>Scan with the camera or upload a QR image / screenshot</div>
          </div>
          <div className="flex gap-2">
            <button
              className={btnSecondarySm}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Icon name="download" size={14} className="rotate-180" />
              {uploading ? 'Decoding…' : 'Upload QR Code'}
            </button>
            <button className={btnPrimarySm} onClick={() => { setLastScan(null); setScannerOpen(true); }}>
              <Icon name="qr" size={14} /> Open Scanner
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadQr}
              className="hidden"
            />
          </div>
        </div>
        {lastScan && (
          <div className={`mt-3 flex items-center gap-2 rounded-md px-3.5 py-2.5 text-[13px] ${lastScan.ok ? 'border border-green-500/30 bg-green-500/[0.08] text-green-400' : 'border border-red-500/30 bg-red-500/[0.08] text-red-400'}`}>
            <Icon name={lastScan.ok ? 'checkCircle' : 'xCircle'} size={16} />
            {lastScan.message}
          </div>
        )}
      </div>

      {scannerOpen && (
        <QrScannerModal
          onClose={() => setScannerOpen(false)}
          onScan={handleQrScan}
        />
      )}

      {/* Manual check-in */}
      <div className={card}>
        <div className={cardTitleMbTight}>Manual Check-in</div>
        <div className={cardSubtitleMb}>
          Enter the attendee's <strong>ticket code</strong> (e.g. <code>TKT-A4B7K9X3</code>) or email.
        </div>
        <form onSubmit={handleCheckIn} className="flex flex-wrap items-end gap-2.5">
          <div className={`${inputWrap} min-w-[240px] flex-1`}>
            <label className={inputLabel}>Ticket code or email</label>
            <input
              className={`${inputField}${/^tkt-/i.test(manualForm.userId) ? ` font-mono uppercase tracking-wider` : ''}`}
              placeholder="TKT-A4B7K9X3   |   rocky@example.com"
              value={manualForm.userId}
              onChange={(e) => { setManualForm((f) => ({ ...f, userId: e.target.value })); setResolveAmbig(null); }}
            />
          </div>
          <div className={`${inputWrap} w-[140px]`}>
            <label className={inputLabel}>User Type</label>
            <select className={inputSelect} value={manualForm.userType}
              onChange={(e) => setManualForm((f) => ({ ...f, userType: e.target.value }))}>
              <option value="attendee">Attendee</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Check In'}
          </button>
        </form>

        {resolveAmbig && (
          <div className="mt-3.5 rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3.5">
            <div className="mb-2.5 flex items-center gap-1.5 text-[13px] text-amber-400">
              <Icon name="warning" size={14} /> Multiple matches — pick the right person:
            </div>
            <div className="flex flex-col gap-1.5">
              {resolveAmbig.matches.map((m) => (
                <button
                  key={m.user_id + (m.ticket_id || '')}
                  type="button"
                  onClick={async () => {
                    setResolveAmbig(null);
                    setSaving(true);
                    try {
                      await attendanceService.checkInManual(eventId, m.user_id, m.user_type || manualForm.userType);
                      useToastStore.getState().success(`Checked in ${m.full_name || m.email || m.user_id}.`);
                      setManualForm({ userId: '', userType: 'attendee' });
                      load();
                    } catch (err) {
                      useToastStore.getState().error(err.response?.data?.message || 'Check-in failed.');
                    } finally { setSaving(false); }
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border-subtle bg-surface px-3.5 py-2.5 text-left text-primary"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{m.full_name || m.email || '—'}</div>
                    <div className="text-xs text-muted">
                      {m.email}{m.extra ? ` · ${m.extra}` : ''}
                      {m.ticket_id ? ` · Ticket ${m.ticket_id.slice(0, 8)}` : ''}
                    </div>
                  </div>
                  <Badge label={m.user_type || 'attendee'} color={m.user_type === 'volunteer' ? 'green' : 'cyan'} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Roster */}
      <div className={card}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Event Roster</div>
            <div className={cardSubtitle}>Everyone expected at this event · {filtered.length} of {counts.total}</div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${filterBar} mb-4`}>
          <SearchInput
            className="relative min-w-[220px] flex-1"
            variant="combined"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className={`${inputSelect} ${inputSelectW160}`}
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="not_arrived">Not arrived</option>
            <option value="checked_in">Currently in</option>
            <option value="checked_out">Checked out</option>
            <option value="ever_checked_in">Has checked in (any)</option>
          </select>
          <select className={`${inputSelect} w-[140px]`}
            value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            <option value="attendee">Attendees</option>
            <option value="volunteer">Volunteers</option>
          </select>
          <select className={`${inputSelect} w-[150px]`}
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="status">Sort: Status</option>
            <option value="name">Sort: Name</option>
            <option value="check_in">Sort: Check-in time</option>
          </select>
        </div>

        {loading ? <PageSpinner /> : filtered.length === 0 ? (
          <EmptyState
            icon="clipboard"
            title={counts.total === 0 ? 'No one expected yet' : 'No matches'}
            description={counts.total === 0
              ? 'Once people buy tickets or volunteers are approved, they\'ll show up here.'
              : 'Try a different search or filter.'}
          />
        ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = getStatus(p);
                  const statusLabel = { not_arrived: 'Not arrived', checked_in: 'Currently in', checked_out: 'Checked out' }[status];
                  const statusColor = { not_arrived: 'amber', checked_in: 'green', checked_out: 'slate' }[status];
                  return (
                    <tr
                      key={p.user_id}
                      className={tableRowClickable}
                      onClick={() => setDetailRecord(p)}
                    >
                      <td>
                        <div className={tdPrimary}>
                          {p.full_name || p.email || '—'}
                        </div>
                        <div className="text-xs text-muted">{p.email}</div>
                        {p.extra && <div className="mt-0.5 text-[11px] text-muted">{p.extra}</div>}
                      </td>
                      <td>
                        <Badge label={p.user_type} color={p.user_type === 'volunteer' ? 'green' : 'cyan'} />
                      </td>
                      <td>
                        <Badge label={statusLabel} color={statusColor} />
                      </td>
                      <td className={textMuted13}>
                        {p.check_in_time ? new Date(p.check_in_time).toLocaleTimeString() : '—'}
                      </td>
                      <td className={textMuted13}>
                        {p.check_out_time ? new Date(p.check_out_time).toLocaleTimeString() : '—'}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {status === 'not_arrived' && (
                          <button className={btnSuccessSm} onClick={() => setConfirmAction({ kind: 'check_in', person: p })}>
                            Check In
                          </button>
                        )}
                        {status === 'checked_in' && (
                          <button className={btnSecondarySm} onClick={() => setConfirmAction({ kind: 'check_out', person: p })}>
                            Check Out
                          </button>
                        )}
                        {status === 'checked_out' && (
                          <button className={btnSuccessSm} onClick={() => setConfirmAction({ kind: 'check_in', person: p })}>
                            Re-check In
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailRecord && (
        <AttendeeDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
          onCheckOut={(userId) => setConfirmAction({ kind: 'check_out', person: { user_id: userId, full_name: detailRecord.full_name, email: detailRecord.email } })}
          onCheckIn={(p) => setConfirmAction({ kind: 'check_in', person: p })}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={async () => {
            const { kind, person } = confirmAction;
            setConfirmAction(null);
            setDetailRecord(null);
            if (kind === 'check_in') await handleQuickCheckIn(person);
            else await handleCheckOut(person.user_id);
          }}
          title={confirmAction.kind === 'check_in' ? 'Confirm check-in' : 'Confirm check-out'}
          message={
            confirmAction.kind === 'check_in'
              ? `Check in ${confirmAction.person.full_name || confirmAction.person.email || 'this person'}? Their arrival will be recorded with the current time.`
              : `Check out ${confirmAction.person.full_name || confirmAction.person.email || 'this person'}? They'll be marked as having left the venue.`
          }
          confirmText={confirmAction.kind === 'check_in' ? 'Check In' : 'Check Out'}
          danger={confirmAction.kind === 'check_out'}
        />
      )}
    </div>
  );
}
