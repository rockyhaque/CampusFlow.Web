import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { eventsService } from '../../services/events.service.js';
import useAuthStore from '../../stores/useAuthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import Icon from '../../components/ui/Icon.jsx';
import SelectMenu from '../../components/ui/SelectMenu.jsx';
import { cfBanner } from '../../utils/cfDynamic.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import { filterBar, pageActions, pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import { btnPrimarySm, cardSm } from '../../components/ui/componentClasses.js';
import {
  eventCard, eventCardBadgeWrap, eventCardBanner, eventCardBody, eventCardCategory,
  eventCardDetailRow, eventCardDetails, eventCardDetailText, eventCardMetaRow,
  eventCardPriceBadge, eventCardTitle,
} from './eventsPageClasses.js';

const STATUSES = ['', 'published', 'ongoing', 'completed', 'cancelled', 'draft'];
const CAN_CREATE = ['ORGANIZER', 'ADMIN'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (status) params.status = status;
    eventsService.listEvents(params)
      .then((r) => {
        setEvents(r.data || []);
        if (r.pagination) {
          setPagination({ ...r.pagination, totalPages: r.pagination.pages || 1 });
        }
      })
      .catch((e) => useToastStore.getState().error(e.response?.data?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  const canCreate = CAN_CREATE.includes(user?.role);

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>Events</div>
            <div className={pageSubtitle}>Browse and manage campus events{pagination.total != null ? ` · ${pagination.total} total` : ''}</div>
          </div>
          {canCreate && (
            <div className={pageActions}>
              <button className={btnPrimarySm} onClick={() => navigate('/events/create')}>
                + New Event
              </button>
            </div>
          )}
        </div>

        <div className={filterBar}>
          <SearchInput
            className="flex-1"
            variant="compact"
            iconSize={15}
            placeholder="Search events…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <SelectMenu
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            placeholder="All statuses"
            options={STATUSES.filter(Boolean).map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
        </div>

        {loading ? <PageSpinner /> : events.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No events found"
            description="Try adjusting your filters or create a new event."
          />
        ) : (
          <div className="mb-2 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {events.map((ev) => <EventCard key={ev.id} event={ev} onClick={() => navigate(`/events/${ev.id}`)} />)}
          </div>
        )}

        <Pagination
          page={pagination.page || page}
          totalPages={pagination.totalPages || 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </>
  );
}

function EventCard({ event: ev, onClick }) {
  return (
    <div className={`${cardSm} ${eventCard}`} onClick={onClick}>
      {/* Banner */}
      <div
        className={`${eventCardBanner}${ev.banner_url ? ' cf-var-banner' : ''}`}
        style={cfBanner(ev.banner_url)}
      >
        <div className={eventCardBadgeWrap}>
          <Badge label={ev.status} />
        </div>
      </div>

      <div className={eventCardBody}>
        <div className={eventCardTitle}>{ev.title}</div>
        <div className={eventCardMetaRow}>
          {ev.category ? <span className={eventCardCategory}>{ev.category}</span> : <span />}
          <span className={`${eventCardPriceBadge} ${ev.is_paid ? 'badge-amber' : 'badge-green'}`}>
            {ev.is_paid ? 'Paid' : 'Free'}
          </span>
        </div>
        <div className={eventCardDetails}>
          {ev.start_date && (
            <div className={eventCardDetailRow}>
              <Icon name="calendar" size={13} />
              <span>{new Date(ev.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
          {(ev.venue || ev.location) && (() => {
            const v = ev.venue || ev.location;
            const online = /^https?:\/\//i.test(v);
            return (
              <div className={eventCardDetailRow}>
                <Icon name={online ? 'spark' : 'mapPin'} size={13} />
                <span className={eventCardDetailText}>{online ? 'Online' : v}</span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
