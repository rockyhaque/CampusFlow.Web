import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge.jsx';
import Icon from '../../../components/ui/Icon.jsx';
import useToastStore from '../../../stores/useToastStore.js';
import { cfProgress } from '../../../utils/cfDynamic.js';
import { btnGhostSm, btnPrimaryFullSm, btnPrimarySm, btnSecondaryFullSm, btnSecondarySm, modalOverlay } from '../../../components/ui/componentClasses.js';
import { fmtDate, fmtTime } from './constants.js';

export default function EventDetailSidebar(props) {
  const {
    event, isVolunteer, isAttendee, isAdmin, needs, myApplication, applyingNeedId,
    ticketTypes, myTicket, qrPreview, setQrPreview, qrDownloading, setQrDownloading,
    onApply, onBuyTicket, onReassign,
  } = props;
  const navigate = useNavigate();
  const toast = useToastStore();
  return (
    <div className="flex flex-col gap-4">
    
                  {/* Volunteer Apply (volunteer only) */}
                  {isVolunteer && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)] border-cyan-400/25">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                        <Icon name="users" size={16} color="var(--accent)" />
                        Volunteer
                      </h3>
    
                      {/* Application deadline — static date */}
                      {!myApplication && event.volunteer_registration_deadline && (event.status === 'published' || event.status === 'ongoing') && (
                        <div className="mb-3.5 flex items-center gap-1.5 text-[13px] text-muted">
                          <Icon name="clock" size={13} />
                          Applications close on {fmtDate(event.volunteer_registration_deadline)} at {fmtTime(event.volunteer_registration_deadline)}
                        </div>
                      )}
    
                      {myApplication ? (
                        // Already applied — show status
                        <div>
                          <div className="text-[13px] text-muted mb-2">
                            Your application status:
                          </div>
                          <Badge
                            label={myApplication.status || 'pending'}
                            color={
                              myApplication.status === 'approved' ? 'green' :
                              myApplication.status === 'rejected' ? 'red' : 'amber'
                            }
                          />
                          {myApplication.role_name && (
                            <div className="mt-2.5 text-[13px] text-default">
                              Role: <strong>{myApplication.role_name}</strong>
                            </div>
                          )}
                          <div className="mt-3 text-xs leading-normal text-muted">
                            {myApplication.status === 'approved' && 'You\'re approved! Check your dashboard for further details.'}
                            {myApplication.status === 'rejected' && 'Your application was not selected this time.'}
                            {(!myApplication.status || myApplication.status === 'pending') && 'The organizer will review your application soon.'}
                          </div>
                        </div>
                      ) : event.status === 'cancelled' || event.status === 'completed' ? (
                        <div className="text-[13px] text-muted">
                          This event is no longer accepting volunteers.
                        </div>
                      ) : event.volunteer_registration_deadline && new Date(event.volunteer_registration_deadline) < new Date() ? (
                        <div className="text-[13px] text-red-400">
                          Volunteer applications closed on {new Date(event.volunteer_registration_deadline).toLocaleString()}.
                        </div>
                      ) : needs.length === 0 ? (
                        <div className="text-[13px] text-muted">
                          The organizer hasn't posted volunteer roles yet. Check back later.
                        </div>
                      ) : (
                        // Show available roles to apply to
                        <div>
                          <div className="text-[13px] text-muted mb-3 leading-normal">
                            Pick a role to apply for:
                          </div>
                          <div className="flex flex-col gap-2">
                            {needs.map((need) => {
                              const filled = (need.applied_count ?? 0) >= (need.headcount ?? 0) && need.headcount > 0;
                              return (
                                <div key={need.id} className="rounded-md border border-border-subtle bg-cyan-400/[0.05] px-3 py-2.5">
                                  <div className="mb-1 flex items-center justify-between gap-2">
                                    <div className="text-sm font-semibold text-primary">
                                      {need.role_name}
                                    </div>
                                    {need.headcount > 0 && (
                                      <span className="text-[11px] text-muted">
                                        {need.applied_count ?? 0}/{need.headcount}
                                      </span>
                                    )}
                                  </div>
                                  {need.description && (
                                    <div className="mb-2 text-xs leading-normal text-muted">
                                      {need.description}
                                    </div>
                                  )}
                                  <button
                                    className={btnPrimaryFullSm}
                                    onClick={() => onApply(need.id)}
                                    disabled={!!applyingNeedId || filled}
                                  >
                                    {applyingNeedId === need.id ? 'Applying…' : filled ? 'Full' : 'Apply'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
    
                  {/* Attendee tickets (attendee only) */}
                  {isAttendee && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)] border-cyan-400/25">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                        <Icon name="ticket" size={16} color="var(--accent)" />
                        Attend This Event as Attendee
                      </h3>
    
                      {(() => {
                        const status = myTicket?.payment_status;
                        const isRejected = status === 'rejected';
                        const isReapplied = status === 'reapplied';
                        const hasActiveTicket = myTicket && !isRejected;
    
                        if (hasActiveTicket) {
                          return (
                            <div>
                              <div className="text-[13px] text-muted mb-2">You have a ticket:</div>
                              <Badge label={status || 'pending'} />
                              {myTicket.ticket_type_name && (
                                <div className="mt-2.5 text-[13px] text-default">
                                  Type: <strong>{myTicket.ticket_type_name}</strong>
                                </div>
                              )}
                              <div className={isReapplied ? 'mt-3 text-xs leading-normal text-blue-400' : 'mt-3 text-[13px] leading-normal text-muted'}>
                                {status === 'confirmed'
                                  ? 'Your ticket is confirmed. Find your QR code in My Tickets.'
                                  : isReapplied
                                  ? 'Your reapplication is under review. The organizer will confirm or reject it shortly.'
                                  : 'Pay at the venue and the organizer will confirm your payment.'}
                              </div>
                              <button
                                className={`${btnSecondaryFullSm} mt-3.5`}
                                onClick={() => navigate('/my-tickets')}
                              >
                                View My Tickets
                              </button>
                            </div>
                          );
                        }
    
                        // Rejected — show notice + Support button (no ticket types)
                        if (isRejected) {
                          return (
                            <div>
                              <div className="text-[13px] text-muted mb-2">You have a ticket:</div>
                              <Badge label="rejected" />
                              {myTicket.ticket_type_name && (
                                <div className="mt-2.5 text-[13px] text-default">
                                  Type: <strong>{myTicket.ticket_type_name}</strong>
                                </div>
                              )}
                              <div className={`text-[13px] text-red-400 mt-3 text-xs leading-normal`}>
                                Your payment could not be verified by the organizer. You can reapply with new payment proof.
                              </div>
                              <button
                                className="inline-flex cursor-default items-center justify-center whitespace-nowrap rounded-[20px] border border-border-soft bg-transparent px-3.5 py-[5px] text-xs font-semibold text-muted mt-3.5 w-full border-red-500/30 bg-red-500/10 font-semibold text-red-400"
                                onClick={() => navigate('/my-tickets')}
                              >
                                Support
                              </button>
                            </div>
                          );
                        }
    
                        // No ticket — show normal purchase flow
                        return (
                          <div className="flex flex-col gap-3">
                            {event.status === 'cancelled' || event.status === 'completed' ? (
                              <div className="text-[13px] text-muted">
                                This event is no longer accepting registrations.
                              </div>
                            ) : event.attendee_registration_deadline && new Date(event.attendee_registration_deadline) < new Date() ? (
                              <div className="text-[13px] text-red-400">
                                Ticket sales closed on {new Date(event.attendee_registration_deadline).toLocaleString()}.
                              </div>
                            ) : !event.is_paid ? (
                              <div className={`text-[13px] text-muted leading-normal`}>
                                This is a free event. No ticket required — just show up at the venue.
                              </div>
                            ) : ticketTypes.length === 0 ? (
                              <div className="text-[13px] text-muted">
                                The organizer hasn't published ticket yet. Check back later.
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2.5">
                                {ticketTypes.map((tt) => {
                                  const soldOut = tt.available_quantity != null && tt.available_quantity <= 0;
                                  const remaining = tt.available_quantity ?? tt.quantity;
                                  const pct = tt.quantity > 0 ? Math.round(((tt.quantity - (tt.available_quantity ?? 0)) / tt.quantity) * 100) : 0;
                                  return (
                                    <div key={tt.id} className={`${soldOut ? "rounded-xl border border-border-subtle bg-surface-2 px-4 py-3.5 opacity-65" : "rounded-xl border border-violet-500/20 bg-surface px-4 py-3.5"}`}>
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <div className="text-sm font-semibold text-primary">{tt.name}</div>
                                          {tt.available_quantity != null && (
                                            <div className={soldOut ? 'mt-1 text-[11px] font-medium text-red-400' : 'mt-1 text-[11px] text-muted'}>
                                              {soldOut ? 'Sold out' : `${remaining} of ${tt.quantity} remaining`}
                                            </div>
                                          )}
                                          {tt.quantity > 0 && (
                                            <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-border-subtle">
                                              <div
                                                className={`h-full rounded-full transition-[width] ${pct >= 90 ? 'bg-red-500' : 'bg-accent'}`}
                                                style={cfProgress(pct)}
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                                          <div className="text-[15px] font-bold text-accent">
                                            {Number(tt.price).toFixed(2)} ৳
                                          </div>
                                          <button
                                            className={soldOut ? `${btnSecondarySm} cursor-not-allowed opacity-60` : btnPrimarySm}
                                            onClick={() => { if (!soldOut) onBuyTicket(tt); }}
                                            disabled={soldOut}
                                          >
                                            {soldOut ? 'Sold Out' : 'Get Ticket'}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
    
                  {/* Organizer */}
                  {(event.organizer_name || event.organizer_email) && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)]">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                        <Icon name="user" size={16} color="var(--accent)" />
                        Organizer
                      </h3>
                      <div className="text-[15px] font-bold tracking-[-0.01em] text-primary">
                        {event.organizer_name || event.organizer_email}
                      </div>
                      <div className="mt-1 text-[13px] text-muted">
                        {event.organizer_email}
                      </div>
                      {isAdmin && (
                        <button
                          className={`${btnSecondaryFullSm} mt-3.5`}
                          onClick={onReassign}
                        >
                          <Icon name="refresh" size={14} /> Reassign to another organizer
                        </button>
                      )}
                    </div>
                  )}
    
                  {/* Event QR code — for sharing & at-venue display */}
                  {event.qr_code_url && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)] text-center">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900 justify-center">
                        <Icon name="qr" size={16} color="var(--accent)" />
                        Event QR Code
                      </h3>
    
                      {/* QR image with hover preview overlay */}
                      <div
                        className="group/event-qr relative mt-1 inline-block cursor-pointer overflow-hidden rounded-xl border border-slate-900/8 bg-white p-2"
                        onClick={() => setQrPreview(true)}
                        title="Click to preview"
                      >
                        <img
                          src={event.qr_code_url}
                          alt={`QR code for ${event.title}`}
                          className="block h-[200px] w-[200px] object-contain"
                          draggable={false}
                        />
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-slate-900/60 opacity-0 transition-opacity duration-[160ms] group-hover/event-qr:opacity-100">
                          <Icon name="eye" size={22} color="#fff" />
                          <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-white">Preview</span>
                        </div>
                      </div>
    
                      {event.event_code && (
                        <div className="mt-3 select-all font-mono text-[13px] font-bold tracking-[0.08em] text-primary">
                          {event.event_code}
                        </div>
                      )}
                      <div className="mt-1 text-[11px] leading-normal text-muted">
                        Scan to open the event page
                      </div>
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        <button
                          type="button"
                          className={btnSecondarySm}
                          onClick={() => {
                            navigator.clipboard?.writeText(event.event_code || '');
                            toast.success('Event code copied');
                          }}
                        >
                          <Icon name="clipboard" size={13} /> Copy code
                        </button>
                        <button
                          type="button"
                          className={btnPrimarySm}
                          disabled={qrDownloading}
                          onClick={async () => {
                            setQrDownloading(true);
                            try {
                              const res = await fetch(event.qr_code_url);
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${event.event_code || 'event'}-qr.png`;
                              a.click();
                              URL.revokeObjectURL(url);
                            } catch {
                              toast.error('Download failed. Try right-clicking the image.');
                            } finally {
                              setQrDownloading(false);
                            }
                          }}
                        >
                          <Icon name="download" size={13} /> {qrDownloading ? 'Downloading…' : 'Download'}
                        </button>
                      </div>
                    </div>
                  )}
    
                  {/* QR preview lightbox */}
                  {qrPreview && (
                    <div
                      className={modalOverlay}
                      onClick={() => setQrPreview(false)}
                    >
                      <div
                        className="flex w-[90%] max-w-[360px] flex-col items-center gap-3.5 rounded-[20px] bg-white p-6 shadow-[0_32px_80px_rgba(2,6,23,0.28)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[15px] font-bold text-primary">
                          {event.title}
                        </div>
                        <img
                          src={event.qr_code_url}
                          alt="QR code preview"
                          className="w-full max-w-[280px] rounded-xl border border-border-subtle"
                        />
                        {event.event_code && (
                          <div className="font-mono text-base font-bold tracking-[0.1em]">
                            {event.event_code}
                          </div>
                        )}
                        <button className={btnGhostSm} onClick={() => setQrPreview(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  )}
    
                  {/* Gallery */}
                  {event.gallery?.length > 0 && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)]">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                        <span className="h-[18px] w-[3px] rounded-sm bg-gradient-to-b from-violet-500 to-cyan-400" />
                        Gallery
                      </h3>
                      <div className="grid grid-cols-3 gap-1.5">
                        {event.gallery.map((img) => (
                          <img
                            key={img.id}
                            src={img.url}
                            alt="gallery"
                            className="aspect-square w-full rounded-sm object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
  );
}
