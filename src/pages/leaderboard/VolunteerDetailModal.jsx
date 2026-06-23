import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { feedbackService } from '../../services/feedback.service.js';
import useToastStore from '../../stores/useToastStore.js';
import DetailTab from './DetailTab.jsx';
import EventRow from './EventRow.jsx';
import RatingDistribution from './RatingDistribution.jsx';
import ReviewCard from './ReviewCard.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { fmtDate, initials } from './utils.js';

export default function VolunteerDetailModal({ volunteerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!volunteerId) return;
    setLoading(true);
    feedbackService.getVolunteerProfile(volunteerId)
      .then((r) => setData(r?.data ?? r))
      .catch(() => useToastStore.getState().error('Failed to load volunteer profile.'))
      .finally(() => setLoading(false));
  }, [volunteerId]);

  if (!volunteerId) return null;

  const p = data?.profile;
  const s = data?.stats;
  const ratings = data?.ratings || [];
  const events = data?.events || [];

  return (
    <Modal isOpen onClose={onClose} title="Volunteer details" size="lg">
      {loading || !data ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <div className="flex flex-col gap-[18px]">
          <div className="flex items-center gap-4 rounded-[14px] border border-purple-500/20 bg-purple-500/[0.06] p-5 px-[22px]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-gradient text-xl font-bold text-white">
              {p.photo_url
                ? <img src={p.photo_url} alt={p.full_name} className="h-full w-full object-cover" />
                : initials(p.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold text-primary">{p.full_name || 'Unknown'}</div>
              <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-muted">
                {p.department && <span>{p.department}</span>}
                {p.batch && <span>· Batch {p.batch}</span>}
                {p.section && <span>· Sec {p.section}</span>}
                {p.created_at && <span>· Joined {fmtDate(p.created_at)}</span>}
              </div>
              {p.bio && (
                <p className="mt-2 text-[12.5px] leading-normal text-muted">{p.bio}</p>
              )}
              {p.skills?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.map((sk) => (
                    <span key={sk} className="rounded-full bg-purple-500/12 px-2 py-0.5 text-[10.5px] font-semibold text-accent">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-[640px]:grid-cols-1 sm:grid-cols-4">
            <StatCard
              variant="tile"
              icon="star"
              label="Avg rating"
              value={s.total_ratings > 0 ? s.avg_rating.toFixed(1) : '—'}
              sub={s.total_ratings > 0 ? `${s.total_ratings} review${s.total_ratings === 1 ? '' : 's'}` : 'No reviews'}
              theme="amber"
            />
            <StatCard variant="tile" icon="calendar" label="Events" value={s.events_count} sub="approved" theme="green" />
            <StatCard variant="tile" icon="clipboard" label="Applications" value={s.applications_count} sub="all-time" theme="sky" />
            <StatCard variant="tile" icon="clock" label="Hours logged" value={s.total_hours > 0 ? `${s.total_hours}` : '—'} sub="recorded" theme="violet" />
          </div>

          <div className="flex gap-1 border-b border-border-subtle" role="tablist" aria-label="Volunteer profile sections">
            <DetailTab
              active={tab === 'overview'}
              label="overview"
              id="vol-tab-overview"
              controls="vol-panel-overview"
              onClick={() => setTab('overview')}
            />
            <DetailTab
              active={tab === 'reviews'}
              label="reviews"
              count={ratings.length}
              id="vol-tab-reviews"
              controls="vol-panel-reviews"
              onClick={() => setTab('reviews')}
            />
            <DetailTab
              active={tab === 'events'}
              label="events"
              count={events.length}
              id="vol-tab-events"
              controls="vol-panel-events"
              onClick={() => setTab('events')}
            />
          </div>

          <div className="max-h-[420px] min-h-[200px] overflow-auto pr-1">
            {tab === 'overview' && (
              <div id="vol-panel-overview" role="tabpanel" aria-labelledby="vol-tab-overview" className="flex flex-col gap-3">
                {s.total_ratings > 0 && (
                  <div>
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Rating breakdown</div>
                    <RatingDistribution ratings={ratings} />
                  </div>
                )}
                {events.length > 0 && (
                  <div>
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Recent events</div>
                    <div className="flex flex-col gap-2">
                      {events.slice(0, 3).map((ev) => <EventRow key={ev.application_id} ev={ev} />)}
                    </div>
                  </div>
                )}
                {s.total_ratings === 0 && events.length === 0 && (
                  <div className="p-[30px] text-center text-[13px] text-muted">No activity recorded yet.</div>
                )}
              </div>
            )}
            {tab === 'reviews' && (
              <div id="vol-panel-reviews" role="tabpanel" aria-labelledby="vol-tab-reviews">
                {ratings.length === 0 ? (
                  <div className="p-[30px] text-center text-[13px] text-muted">
                    This volunteer hasn't been rated yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {ratings.map((r) => <ReviewCard key={r.id} review={r} />)}
                  </div>
                )}
              </div>
            )}
            {tab === 'events' && (
              <div id="vol-panel-events" role="tabpanel" aria-labelledby="vol-tab-events">
                {events.length === 0 ? (
                  <div className="p-[30px] text-center text-[13px] text-muted">
                    This volunteer hasn't applied to any events yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {events.map((ev) => <EventRow key={ev.application_id} ev={ev} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
