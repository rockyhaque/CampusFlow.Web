import Icon from '../../../components/ui/Icon.jsx';
import StarRating from '../../../components/ui/StarRating.jsx';
import { fmtDate, fmtTime } from './constants.js';

export default function EventDetailMainColumn({ event, eventFeedback }) {
  return (
    <div className="flex flex-col gap-4">
                  {/* About */}
                  {event.description && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)]">
                      <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                        <span className="h-[18px] w-[3px] rounded-sm bg-gradient-to-b from-violet-500 to-cyan-400" />
                        About this event
                      </h3>
                      <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-slate-700">{event.description}</div>
                    </div>
                  )}
    
                  {/* Registration deadlines */}
                  <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)]">
                    <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900">
                      <span className="h-[18px] w-[3px] rounded-sm bg-gradient-to-b from-violet-500 to-cyan-400" />
                      Registration deadlines
                    </h3>
                    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-3">
                      <div className="rounded-md border border-green-500/[0.18] bg-green-500/[0.05] px-3.5 py-3">
                        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-green-400">
                          Volunteer applications close
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {event.volunteer_registration_deadline
                            ? `${fmtDate(event.volunteer_registration_deadline)} · ${fmtTime(event.volunteer_registration_deadline)}`
                            : 'Same as event start'}
                        </div>
                      </div>
                      <div className="rounded-md border border-amber-500/[0.18] bg-amber-500/[0.05] px-3.5 py-3">
                        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-400">
                          Ticket sales close
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {event.attendee_registration_deadline
                            ? `${fmtDate(event.attendee_registration_deadline)} · ${fmtTime(event.attendee_registration_deadline)}`
                            : 'Same as event start'}
                        </div>
                      </div>
                    </div>
                  </div>
    
                  {/* Event ratings — only after the event completes */}
                  {eventFeedback && eventFeedback.count > 0 && (
                    <div className="rounded-2xl border border-slate-900/8 bg-white px-6 py-[22px] shadow-[0_6px_18px_rgba(2,6,23,0.04)] border-amber-500/25">
                      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="mb-3.5 flex items-center gap-2.5 text-base font-bold tracking-[-0.01em] text-slate-900 m-0">
                          <Icon name="star" size={18} color="var(--amber-400)" />
                          Attendee Feedback
                          <span className="ml-2 text-xs font-normal text-muted">
                            from {eventFeedback.count} {eventFeedback.count === 1 ? 'review' : 'reviews'}
                          </span>
                        </h3>
                        <StarRating value={eventFeedback.average} count={eventFeedback.count} size={18} />
                      </div>
    
                      {/* Recent comments */}
                      {eventFeedback.list.filter((x) => x.comment).slice(0, 5).length > 0 && (
                        <div className="flex flex-col gap-2.5">
                          {eventFeedback.list.filter((x) => x.comment).slice(0, 5).map((fb, i) => (
                            <div key={fb.id || i} className="rounded-md border border-border-subtle bg-cyan-400/[0.04] px-3.5 py-2.5">
                              <div className="mb-[5px] flex items-center justify-between gap-2">
                                <div className="text-[13px] font-medium text-primary">
                                  {fb.full_name || fb.user_name || 'Anonymous'}
                                </div>
                                <StarRating value={fb.rating || fb.score || 0} size={11} showValue={false} />
                              </div>
                              <div className="text-[13px] italic leading-normal text-default">
                                "{fb.comment}"
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
    
  );
}
