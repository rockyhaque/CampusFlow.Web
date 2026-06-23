import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { feedbackService } from '../../services/feedback.service.js';
import useToastStore from '../../stores/useToastStore.js';
import {
  btnGhostSm,
  btnPrimarySm,
  inputLabel,
  inputWrap,
  textareaField,
} from '../../components/ui/componentClasses.js';

export default function SubmitEventFeedbackModal({ event, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { useToastStore.getState().error('Please select a star rating.'); return; }
    setSaving(true);
    try {
      await feedbackService.submitEventFeedback(event.id, {
        rating,
        comment: comment.trim() || undefined,
      });
      useToastStore.getState().success('Feedback submitted!');
      onClose();
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Failed to submit feedback.');
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
      title="Rate Event"
      size="460"
    >
      <div className="mb-4 text-sm text-muted">{event?.title}</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 text-[13px] text-muted">Your Rating</div>
          <StarRating value={rating} onChange={setRating} size={26} emptyClass="text-slate-900/15" />
        </div>
        <div className={inputWrap}>
          <label className={inputLabel}>Comment (optional)</label>
          <textarea
            className={textareaField}
            rows={3}
            placeholder="Share your experience…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2.5">
          <button type="button" className={btnGhostSm} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimarySm} disabled={saving}>
            {saving ? <><Spinner size="sm" /> Submitting…</> : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
