import Badge from '../../../components/ui/Badge.jsx';
import Icon from '../../../components/ui/Icon.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import useToastStore from '../../../stores/useToastStore.js';
import {
  badgeBase, badgeColor, btnDangerSm, btnGhostSm, btnSecondarySm, btnSuccessSm,
  cardHeader, cardTitle,
} from '../../../components/ui/componentClasses.js';

export default function AttendeeDetailModal({ record, onClose, onCheckOut, onCheckIn }) {
  const checkIn = record.check_in_time || record.checked_in_at;
  const checkOut = record.check_out_time || record.checked_out_at;
  const name = record.full_name || record.user_name || 'Unnamed';
  const email = record.email || record.user_email || '—';

  const fmtFull = (d) => d ? new Date(d).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  const duration = checkIn ? (() => {
    const end = checkOut ? new Date(checkOut) : new Date();
    const ms = end - new Date(checkIn);
    const mins = Math.max(0, Math.floor(ms / 60000));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  })() : '—';

  const fields = [
    { label: 'Full name', value: name },
    { label: 'Email', value: email },
    { label: 'Role at event', value: <Badge label={record.user_type || 'attendee'} color={record.user_type === 'volunteer' ? 'green' : 'cyan'} /> },
    { label: 'Ticket type', value: record.ticket_type_name },
    { label: 'Payment', value: record.payment_status ? <Badge label={record.payment_status} color={record.payment_status === 'confirmed' ? 'green' : 'amber'} /> : null },
    { label: 'Student ID', value: record.student_id },
    { label: 'Batch', value: record.batch },
    { label: 'Section', value: record.section },
    { label: 'Department', value: record.department },
    { label: 'Phone', value: record.phone },
    { label: 'Check-in time', value: fmtFull(checkIn) },
    { label: 'Check-out time', value: fmtFull(checkOut) },
    { label: 'Duration in venue', value: duration },
    { label: 'Status', value: <Badge label={!checkIn ? 'not arrived' : !checkOut ? 'checked in' : 'checked out'} color={!checkIn ? 'slate' : !checkOut ? 'green' : 'amber'} /> },
    { label: 'Ticket expires', value: record.expires_at ? fmtFull(record.expires_at) : null },
    { label: 'Notes', value: record.notes },
    { label: 'Ticket UUID', value: record.ticket_id ? <span className="break-all font-mono text-xs">{record.ticket_id}</span> : '—' },
    { label: 'User ID', value: record.user_id ? <span className="break-all font-mono text-xs">{record.user_id}</span> : '—' },
    { label: 'Recorded at', value: fmtFull(record.created_at) },
  ];

  const header = (
    <div className={cardHeader}>
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {record.photo_url ? (
          <img
            src={record.photo_url}
            alt={name}
            className="h-14 w-14 rounded-full border-2 border-cyan-400/30 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xl font-bold text-accent">
            {(name || email || '?').toString().trim().charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className={`${cardTitle} m-0 truncate`}>
            {name}
          </div>
          <div className="truncate text-[13px] text-muted">
            {email}
          </div>
        </div>
      </div>
      <button type="button" className={btnGhostSm} onClick={onClose}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );

  return (
    <Modal isOpen onClose={onClose} header={header} size="620">
      {record.short_code && (
        <div className="my-3 flex items-center gap-3.5 rounded-md border border-cyan-400/35 bg-gradient-to-br from-cyan-400/[0.12] to-teal-700/[0.06] px-4 py-3.5">
          <Icon name="ticket" size={20} color="var(--accent)" />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[11px] uppercase tracking-[0.08em] text-muted">
              Ticket code
            </div>
            <div className="select-all font-mono text-lg font-bold tracking-wider text-accent">
              {record.short_code}
            </div>
          </div>
          <button
            type="button"
            className={btnSecondarySm}
            onClick={() => {
              navigator.clipboard?.writeText(record.short_code);
              useToastStore.getState().success('Code copied to clipboard.');
            }}
            title="Copy"
          >
            Copy
          </button>
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {fields.map(({ label, value }) => (
          <div key={label} className="border-b border-border-subtle py-2">
            <div className="mb-[3px] text-[11px] uppercase tracking-[0.06em] text-muted">{label}</div>
            <div className="text-sm text-default">
              {value == null || value === '' ? '—' : value}
            </div>
          </div>
        ))}
      </div>

      {record.skills?.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.06em] text-muted">Skills</div>
          <div className="flex flex-wrap gap-1.5">
            {record.skills.map((s) => (
              <span key={s} className={`${badgeBase} ${badgeColor('slate')}`}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2.5">
        {!checkIn && onCheckIn && (
          <button type="button" className={btnSuccessSm} onClick={() => onCheckIn(record)}>
            Check In
          </button>
        )}
        {checkIn && !checkOut && (
          <button type="button" className={btnDangerSm} onClick={() => onCheckOut(record.user_id)}>
            Check Out
          </button>
        )}
        {checkIn && checkOut && onCheckIn && (
          <button type="button" className={btnSuccessSm} onClick={() => onCheckIn(record)}>
            Re-check In
          </button>
        )}
        <button type="button" className={btnSecondarySm} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
