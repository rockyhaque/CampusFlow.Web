import { useState } from 'react';
import Modal from './Modal.jsx';
import StarRating from './StarRating.jsx';
import useToastStore from '../../stores/useToastStore.js';
import {
  btnGhostSm,
  btnPrimarySm,
  inputLabel,
  inputWrap,
  textareaField,
} from './componentClasses.js';

/**
 * Reusable star-rating + comment modal.
 */
export default function RatingModal({ title, subtitle, onClose, onSubmit, submitLabel = 'Submit Rating' }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      useToastStore.getState().error('Please select a star rating.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ rating, comment: comment.trim() || undefined });
      useToastStore.getState().success('Rating submitted. Thank you!');
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
      title={title}
      subtitle={subtitle}
      size="480"
    >
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-[18px]">
        <div>
          <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
            Your rating
          </div>
          <StarRating
            value={rating}
            onChange={setRating}
            size={36}
            showLabels
            useButton
          />
        </div>

        <div className={inputWrap}>
          <label className={inputLabel}>
            Comment{' '}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            className={textareaField}
            rows={3}
            placeholder="Share your experience…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <div className="mt-1 text-right text-[11px] text-muted">
            {comment.length}/1000
          </div>
        </div>

        <div className="flex justify-end gap-2.5">
          <button type="button" className={btnGhostSm} onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className={btnPrimarySm} disabled={saving || !rating}>
            {saving ? 'Submitting…' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
