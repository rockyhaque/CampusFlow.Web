import Modal from '../../../components/ui/Modal.jsx';
import { btnGhostSm, btnPrimarySm, inputLabel, inputSelect, inputWrap } from '../../../components/ui/componentClasses.js';

export default function ReassignOrganizerModal({
  open, event, organizers, selectedOrganizerId, setSelectedOrganizerId,
  reassignLoading, onClose, onConfirm,
}) {
  if (!open || !event) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      onOverlayClick={() => !reassignLoading && onClose()}
      closeDisabled={reassignLoading}
      headerVariant="card"
      title="Reassign Organizer"
      size="480"
    >
      <p className="mb-4 mt-0 text-sm leading-normal text-muted">
        Transfer ownership of <strong className="text-primary">{event.title}</strong> to a different approved organizer. They will gain full management access; the current organizer will lose it.
      </p>
      <div className={`${inputWrap} mb-[18px]`}>
        <label className={inputLabel} htmlFor="organizer-select">New Organizer</label>
        <select
          id="organizer-select"
          className={inputSelect}
          value={selectedOrganizerId}
          onChange={(e) => setSelectedOrganizerId(e.target.value)}
          disabled={reassignLoading}
        >
          <option value="">— Select an organizer —</option>
          {organizers
            .filter((o) => o.id !== event.organizer_id)
            .map((o) => (
              <option key={o.id} value={o.id}>
                {o.full_name || o.email} ({o.email})
              </option>
            ))}
        </select>
        {organizers.length === 0 && (
          <div className="mt-1.5 text-xs text-muted">Loading organizers…</div>
        )}
      </div>
      <div className="flex justify-end gap-2.5">
        <button type="button" className={btnGhostSm} onClick={onClose} disabled={reassignLoading}>
          Cancel
        </button>
        <button
          type="button"
          className={btnPrimarySm}
          onClick={onConfirm}
          disabled={!selectedOrganizerId || reassignLoading}
        >
          {reassignLoading ? 'Reassigning…' : 'Reassign Organizer'}
        </button>
      </div>
    </Modal>
  );
}
