import Badge from '../../../components/ui/Badge.jsx';
import Icon from '../../../components/ui/Icon.jsx';
import Countdown from '../../../components/ui/Countdown.jsx';
import { STATUS_COLOR, eventBannerVars } from './constants.js';

export default function EventDetailHero({ event, countdownConfig, dateRange, startDate, startTime, endDate, endTime, venueRaw, isOnline, venue, attendeeCap, volunteerCap }) {
  return (
    <>
                {/* Banner hero with overlaid title */}
                <div
                  className={`relative flex min-h-[360px] w-full items-end overflow-hidden bg-[linear-gradient(135deg,rgba(139,92,246,0.18),rgba(34,211,238,0.14)),linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] bg-cover bg-center px-8 py-7 max-[720px]:min-h-[280px] max-[720px]:px-5 max-[720px]:py-[22px] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_80%_0%,rgba(139,92,246,0.20),transparent_55%)] before:content-[""]${event.banner_url ? ' cf-var-event-banner' : ''}`}
                  style={eventBannerVars(event.banner_url)}
                >
                  <div className="absolute right-[18px] top-[18px] z-[2] flex flex-wrap gap-2 [&_.badge]:border [&_.badge]:border-white/25 [&_.badge]:font-semibold [&_.badge]:text-white [&_.badge]:shadow-[0_8px_20px_rgba(2,6,23,0.18)] [&_.badge]:backdrop-blur-[8px] [&_.badge-amber]:bg-amber-500/92 [&_.badge-cyan]:bg-cyan-500/92 [&_.badge-green]:bg-green-600/92 [&_.badge-purple]:bg-purple-600/92 [&_.badge-red]:bg-red-600/92 [&_.badge-slate]:bg-slate-700/92">
                    {event.status && event.status !== 'published' && (
                      <Badge label={event.status} color={STATUS_COLOR[event.status] || 'slate'} />
                    )}
                    {event.is_paid && <Badge label="Paid" color="amber" />}
                  </div>
                  <div className="relative z-[1] flex w-full flex-col gap-2">
                    {event.category && (
                      <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/85 backdrop-blur-[10px]">
                        <Icon name="spark" size={11} /> {event.category}
                      </span>
                    )}
                    <h1 className="m-0 text-[40px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white [text-shadow:0_4px_24px_rgba(2,6,23,0.5)] max-[720px]:text-[28px]">{event.title}</h1>
                    <div className="mt-2 flex flex-wrap gap-[18px] text-sm text-white/92">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="calendar" size={14} /> {dateRange}
                      </span>
                      {(venueRaw || isOnline) && (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name={isOnline ? 'spark' : 'mapPin'} size={14} />
                          {isOnline ? 'Online event' : venue}
                        </span>
                      )}
                      {event.organizer_name && (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="user" size={14} /> By {event.organizer_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
    
                {/* Live countdown strip */}
                {countdownConfig && (
                  <div className="flex flex-wrap items-center justify-between gap-[18px] border-b border-violet-500/14 bg-gradient-to-r from-violet-500/[0.07] to-fuchsia-500/[0.04] px-6 py-[18px]">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-600/90">{countdownConfig.title}</div>
                      <div className="text-sm font-medium text-slate-700">{countdownConfig.sub}</div>
                    </div>
                    <Countdown
                      target={countdownConfig.target}
                      variant={countdownConfig.variant}
                      size="md"
                    />
                  </div>
                )}
    
                {/* Quick-meta strip */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 border-b border-slate-900/6 bg-slate-50/50 p-5">
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-900/8 bg-white px-4 py-3.5 transition-all duration-[120ms] hover:-translate-y-px hover:border-violet-500/30 hover:shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-cyan-400/10 text-cyan-400">
                      <Icon name="calendar" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Starts</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900">{startDate}{startTime ? ' · ' + startTime : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-900/8 bg-white px-4 py-3.5 transition-all duration-[120ms] hover:-translate-y-px hover:border-violet-500/30 hover:shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-amber-500/10 text-amber-400">
                      <Icon name="clock" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Ends</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900">{endDate}{endTime ? ' · ' + endTime : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-900/8 bg-white px-4 py-3.5 transition-all duration-[120ms] hover:-translate-y-px hover:border-violet-500/30 hover:shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-purple-500/10 text-purple-400">
                      <Icon name={isOnline ? 'spark' : 'mapPin'} size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{isOnline ? 'Meeting Link' : 'Venue'}</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900" title={venue}>
                        {isOnline ? (
                          <a href={venueRaw} target="_blank" rel="noopener noreferrer" className="text-accent">Join online</a>
                        ) : venue}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-900/8 bg-white px-4 py-3.5 transition-all duration-[120ms] hover:-translate-y-px hover:border-violet-500/30 hover:shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-violet-500/10 text-[#a855f7]">
                      <Icon name="ticket" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Attendee Capacity</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900">{attendeeCap}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-900/8 bg-white px-4 py-3.5 transition-all duration-[120ms] hover:-translate-y-px hover:border-violet-500/30 hover:shadow-[0_8px_20px_rgba(2,6,23,0.06)]">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-green-500/10 text-green-400">
                      <Icon name="users" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Volunteer Capacity</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-900">{volunteerCap}</div>
                    </div>
                  </div>
                </div>
    </>
  );
}
