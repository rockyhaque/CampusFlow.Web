import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { feedbackService } from '../../services/feedback.service.js';
import useToastStore from '../../stores/useToastStore.js';
import {
  btnGhostSm,
  btnPrimarySm,
  inputField,
  inputLabel,
  inputWrap,
  textareaField,
} from '../../components/ui/componentClasses.js';
import { fmtDate } from './utils.js';

export default function RateVolunteerModal({ volunteer, onClose, onSuccess }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    feedbackService.getVolunteerRatableEvents(volunteer.id)
      .then((data) => setEvents(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, [volunteer.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) { useToastStore.getState().error('Please select an event.'); return; }
    if (!rating) { useToastStore.getState().error('Please give a star rating.'); return; }
    setSaving(true);
    try {
      await feedbackService.rateVolunteer(selectedEvent, volunteer.id, {
        rating,
        comment: comment.trim() || undefined,
      });
      useToastStore.getState().success('Rating submitted!');
      onSuccess?.();
      onClose();
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      onOverlayClick={() => !saving && onClose()}
      closeDisabled={saving}
      headerVariant="card"
      title="Rate Volunteer"
      size="460"
    >
      <div className="mb-[18px] flex items-center gap-3 border-b border-border-subtle pt-2.5 pb-[18px]">
        <Avatar name={volunteer.full_name} photoUrl={volunteer.photo_url} size="hero" variant="violet" />
        <div>
          <div className="text-[15px] font-bold text-primary">{volunteer.full_name}</div>
          {volunteer.department && <div className="mt-0.5 text-xs text-muted">{volunteer.department}</div>}
        </div>
        {volunteer.avg_rating > 0 && (
          <div className="ml-auto text-right">
            <StarRating value={volunteer.avg_rating} readonly size={13} showValue={false} emptyClass="text-slate-900/15" />
            <div className="mt-0.5 text-xs text-muted">{volunteer.avg_rating} avg</div>
          </div>
        )}
      </div>
      {loadingEvents ? (
        <div className="flex justify-center p-6"><Spinner size="sm" /></div>
      ) : events.length === 0 ? (
        <div className="py-4 text-center text-sm text-muted">
          No shared completed events found to rate this volunteer.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className={inputWrap}>
            <label className={inputLabel}>Select Event</label>
            <select className={inputField} value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option value="">Choose an event…</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title} — {fmtDate(ev.start_date)}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-2 text-[13px] text-muted">Your Rating</div>
            <StarRating value={rating} onChange={setRating} size={26} emptyClass="text-slate-900/15" />
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Comment (optional)</label>
            <textarea
              className={textareaField}
              rows={3}
              placeholder="How did this volunteer perform?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2.5">
            <button type="button" className={btnGhostSm} onClick={onClose}>Cancel</button>
            <button type="submit" className={btnPrimarySm} disabled={saving || !selectedEvent || !rating}>
              {saving ? <><Spinner size="sm" /> Submitting…</> : 'Submit Rating'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
