import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { PageSpinner, Spinner } from '../../components/ui/Spinner.jsx';
import { ticketsService } from '../../services/tickets.service.js';
import { feedbackService } from '../../services/feedback.service.js';
import { PAYMENT_METHOD_TYPES } from '../../services/paymentMethods.service.js';
import useToastStore from '../../stores/useToastStore.js';
import Icon from '../../components/ui/Icon.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import RatingModal from '../../components/ui/RatingModal.jsx';
import { fmtDate } from '../../utils/format.js';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  alertBoxDanger,
  btnGhostSm,
  btnPrimarySm,
  btnSecondarySm,
  btnSuccessSm,
  cardHeader,
  cardTitle,
  codeSm,
  formActionsEndSm,
  formStackSm,
  inputField,
  inputHint,
  inputLabel,
  inputSelect,
  inputWrap,
  qrFullscreenActions,
  qrFullscreenCloseBtn,
  qrFullscreenHint,
  qrFullscreenImg,
  qrFullscreenOverlay,
  qrFullscreenPanel,
  qrFullscreenSubtitle,
  qrFullscreenTitle,
  qrFullscreenTitleWrap,
  stackGap3,
  textareaField,
  ticketCodeBox,
  ticketCodeHint,
  ticketCodeLabel,
  ticketCodeValue,
  ticketDetailActions,
  ticketDetailGrid,
  ticketDetailPanel,
  ticketInfoGrid,
  ticketInfoLabel,
  ticketInfoRow,
  ticketInfoValue,
  ticketListAside,
  ticketListCard,
  ticketListIcon,
  ticketListMeta,
  ticketListPrice,
  ticketListRow,
  ticketListTitle,
  ticketNoticeRow,
  ticketQrCaption,
  ticketQrImg,
  ticketQrPreview,
  ticketReapplyBtn,
  ticketShortCode,
} from '../../components/ui/componentClasses.js';

// ── Reapply Modal ─────────────────────────────────────────────────────────────
function ReapplyModal({ ticket, onClose, onSuccess }) {
  const [form, setForm] = useState({ reason: '', paymentProvider: '', paymentReference: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToastStore.getState();

  const canSubmit = form.reason.trim() && form.paymentProvider && form.paymentReference.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await ticketsService.reapplyTicket(ticket.id, {
        reason: form.reason.trim(),
        paymentReference: form.paymentReference.trim(),
        paymentProvider: form.paymentProvider.trim() || undefined,
      });
      toast.success('Reapplication submitted — the organizer will review it.');
      onSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reapplication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      headerVariant="card"
      title="Reapply for Ticket"
      subtitle={ticket.event_title}
      size="480"
    >
      <div className={alertBoxDanger}>
        Your previous payment could not be verified by the organizer. Provide your new payment proof and explain what happened.
      </div>

      <form onSubmit={handleSubmit} className={formStackSm}>
          <div className={inputWrap}>
            <label className={inputLabel}>Reason for Reapplication *</label>
            <textarea
              className={textareaField}
              rows={3}
              placeholder="e.g. I sent the payment via bKash but used the wrong reference. Here is the correct transaction ID..."
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
          </div>

          <div className={inputWrap}>
            <label className={inputLabel}>Payment Provider *</label>
            <select
              className={inputSelect}
              value={form.paymentProvider}
              onChange={(e) => setForm((f) => ({ ...f, paymentProvider: e.target.value }))}
            >
              <option value="">Select provider…</option>
              {PAYMENT_METHOD_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className={inputWrap}>
            <label className={inputLabel}>New Transaction ID *</label>
            <input
              className={inputField}
              placeholder="e.g. BKS8TXN1234567"
              value={form.paymentReference}
              onChange={(e) => setForm((f) => ({ ...f, paymentReference: e.target.value }))}
            />
            <div className={`${inputHint} mt-1`}>
              Previous reference: <code className={codeSm}>{ticket.payment_reference || '—'}</code>
            </div>
          </div>

          <div className={formActionsEndSm}>
            <button type="button" className={btnSecondarySm} onClick={onClose}>Cancel</button>
            <button type="submit" className={btnPrimarySm} disabled={!canSubmit || submitting}>
              {submitting ? <Spinner size="sm" /> : 'Submit Reapplication'}
            </button>
          </div>
        </form>
    </Modal>
  );
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reapplyTicket, setReapplyTicket] = useState(null); // ticket to reapply for
  const [qrFullscreen, setQrFullscreen] = useState(null);
  const [rating, setRating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ticketsService.getMyTickets()
      .then((r) => setTickets(r.data || []))
      .catch(() => useToastStore.getState().error('Failed to load tickets.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadQr = async (ticket) => {
    if (!ticket?.qr_code_url) return;
    const eventSlug = (ticket.event_title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const filename = `ticket-${eventSlug}-${ticket.id?.slice(0, 8) || 'qr'}.png`;
    try {
      const res = await fetch(ticket.qr_code_url);
      if (!res.ok) throw new Error('Failed to fetch QR');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      useToastStore.getState().success('QR code downloaded.');
    } catch {
      // Fallback: open the image in a new tab so the user can right-click → save
      window.open(ticket.qr_code_url, '_blank', 'noopener');
      useToastStore.getState().info('QR opened in a new tab — right-click to save.');
    }
  };

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>My Tickets</div>
            <div className={pageSubtitle}>Tickets you have purchased · {tickets.length} total</div>
          </div>
          <button className={btnPrimarySm} onClick={() => navigate('/events')}>Browse Events</button>
        </div>

        {loading ? <PageSpinner /> : tickets.length === 0 ? (
          <EmptyState
            icon="ticket"
            title="No tickets yet"
            description="Browse events and purchase a ticket to attend."
          />
        ) : (
          <div className={stackGap3}>
            {tickets.map((t) => {
              const isRejected = t.payment_status === 'rejected';
              const isReapplied = t.payment_status === 'reapplied';
              const hasNotice = isRejected || isReapplied;
              const cardStatus = isRejected ? 'rejected' : isReapplied ? 'reapplied' : 'default';
              return (
                <div
                  key={t.id}
                  className={ticketListCard(cardStatus)}
                  onClick={() => !hasNotice && setSelected(selected?.id === t.id ? null : t)}
                >
                  {/* Main row */}
                  <div className={ticketListRow}>
                    <div className={ticketListIcon(cardStatus)}>
                      <Icon name="ticket" size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={ticketListTitle}>
                        {t.event_title || 'Event'}
                      </div>
                      <div className={ticketListMeta}>
                        <span>{t.ticket_type_name || t.ticket_type || 'General'} · {fmtDate(t.event_date || t.purchased_at)}</span>
                        {t.short_code && (
                          <span className={ticketShortCode}>{t.short_code}</span>
                        )}
                      </div>
                    </div>

                    <div className={ticketListAside}>
                      <Badge label={t.payment_status || t.status || 'pending'} />
                      {t.price != null && (
                        <span className={ticketListPrice}>
                          {Number(t.price).toFixed(2)} ৳
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notice row — inside the card */}
                  {hasNotice && (
                    <div className={ticketNoticeRow(isReapplied)}>
                      <Icon name={isReapplied ? 'clock' : 'xCircle'} size={15} />
                      <span className="flex-1">
                        {isReapplied
                          ? 'Your reapplication is under review by the organizer.'
                          : 'Your payment could not be verified. Contact the organizer or reapply with new payment proof.'}
                      </span>
                      {isRejected && (
                        <button
                          type="button"
                          className={ticketReapplyBtn}
                          onClick={(e) => { e.stopPropagation(); setReapplyTicket(t); }}
                        >
                          Support / Reapply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Ticket detail panel */}
        {selected && (
          <div className={ticketDetailPanel}>
            <div className={cardHeader}>
              <div className={cardTitle}>Ticket Details</div>
              <button className={btnGhostSm} onClick={() => setSelected(null)}>
                <Icon name="x" size={14} />
              </button>
            </div>

            <div className={ticketDetailGrid(!!selected.qr_code_url)}>
              {/* Ticket info */}
              <div>
                {/* Big ticket-code badge */}
                {selected.short_code && (
                  <div className={ticketCodeBox}>
                    <div className={ticketCodeLabel}>Ticket code</div>
                    <div className={ticketCodeValue}>{selected.short_code}</div>
                    <div className={ticketCodeHint}>
                      Show this code or your QR at the entrance
                    </div>
                  </div>
                )}

                <div className={ticketInfoGrid}>
                  {[
                    ['Event', selected.event_title],
                    ['Type', selected.ticket_type_name || selected.ticket_type || 'General'],
                    ['Payment', selected.payment_type],
                    ['Status', selected.payment_status || selected.status],
                    ['Price', selected.price != null ? `${Number(selected.price).toFixed(2)} ৳` : 'Free'],
                    ['Expires', selected.expires_at
                      ? new Date(selected.expires_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
                      : '—'],
                    ['Purchased', fmtDate(selected.purchased_at || selected.created_at)],
                    ['Check-in', selected.checked_in_at ? fmtDate(selected.checked_in_at) : 'Not yet'],
                  ].map(([label, val]) => (
                    <div key={label} className={ticketInfoRow}>
                      <div className={ticketInfoLabel}>{label}</div>
                      <div className={ticketInfoValue}>{val || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR code preview */}
              {selected.qr_code_url && (
                <div className={ticketQrPreview}>
                  <img
                    src={selected.qr_code_url}
                    alt="Ticket QR code"
                    className={ticketQrImg}
                  />
                  <div className={ticketQrCaption}>
                    Show this at the entrance
                  </div>
                </div>
              )}
            </div>

            <div className={ticketDetailActions}>
              {selected.qr_code_url && (
                <>
                  <button className={btnPrimarySm} onClick={() => setQrFullscreen(selected)}>
                    <Icon name="qr" size={14} /> Show at Entrance
                  </button>
                  <button className={btnSecondarySm} onClick={() => handleDownloadQr(selected)}>
                    <Icon name="download" size={14} /> Download QR
                  </button>
                </>
              )}
              {/* Rate Event — only for completed events the attendee was checked in to */}
              {selected.event_status === 'completed' && (
                <button
                  className={btnSuccessSm}
                  onClick={() => setRating({
                    eventId: selected.event_id,
                    eventTitle: selected.event_title,
                  })}
                >
                  <Icon name="star" size={14} /> Rate this Event
                </button>
              )}
              {selected.event_id && (
                <button className={btnSecondarySm} onClick={() => navigate(`/events/${selected.event_id}`)}>
                  View Event
                </button>
              )}
            </div>
          </div>
        )}

        {reapplyTicket && (
          <ReapplyModal
            ticket={reapplyTicket}
            onClose={() => setReapplyTicket(null)}
            onSuccess={(updated) => {
              setTickets((prev) => prev.map((t) => t.id === updated.id ? { ...t, ...updated } : t));
              setReapplyTicket(null);
            }}
          />
        )}

        {/* Fullscreen QR overlay (for showing at the gate) */}
        {rating && (
          <RatingModal
            title={`Rate "${rating.eventTitle}"`}
            subtitle="Help future attendees by sharing your experience"
            onClose={() => setRating(null)}
            onSubmit={(payload) => feedbackService.submitEventFeedback(rating.eventId, payload)}
            submitLabel="Submit Rating"
          />
        )}

        {qrFullscreen && (
          <div
            className={qrFullscreenOverlay}
            onClick={() => setQrFullscreen(null)}
          >
            <div
              className={qrFullscreenPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={qrFullscreenTitleWrap}>
                <div className={qrFullscreenTitle}>
                  {qrFullscreen.event_title || 'Event Ticket'}
                </div>
                <div className={qrFullscreenSubtitle}>
                  {qrFullscreen.ticket_type_name || qrFullscreen.ticket_type || 'General'} ·{' '}
                  ID {qrFullscreen.id?.slice(0, 8)}
                </div>
              </div>

              <img
                src={qrFullscreen.qr_code_url}
                alt="Ticket QR code"
                className={qrFullscreenImg}
              />

              <div className={qrFullscreenHint}>
                Show this QR to the organizer or volunteer staff at the entrance.
                Tap anywhere outside to close.
              </div>
              <div className={qrFullscreenActions}>
                <button
                  className={btnPrimarySm}
                  onClick={() => handleDownloadQr(qrFullscreen)}
                >
                  <Icon name="download" size={14} /> Download
                </button>
                <button
                  className={qrFullscreenCloseBtn}
                  onClick={() => setQrFullscreen(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
