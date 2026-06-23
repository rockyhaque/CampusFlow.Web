import { useCallback, useMemo, useState } from 'react';
import { Spinner } from '../../components/ui/Spinner.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { feedbackService } from '../../services/feedback.service.js';
import useToastStore from '../../stores/useToastStore.js';
import VolunteerCard from './VolunteerCard.jsx';
import { fmtDate } from './utils.js';

const toolbarSelectClass = "cursor-pointer appearance-none rounded-[9px] border border-slate-900/12 bg-slate-50/80 bg-[length:12px] bg-[right_9px_center] bg-no-repeat py-2 pl-[11px] pr-7 font-sans text-[13px] font-medium text-default outline-none transition-all duration-fast [background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] focus:border-violet-500/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]";

const filterChipClass = "inline-flex items-center gap-[5px] rounded-full border border-violet-500/20 bg-violet-500/10 py-[3px] pl-2.5 pr-2 text-xs font-semibold text-violet-500/90 [&_button]:flex [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0 [&_button]:text-sm [&_button]:leading-none [&_button]:text-inherit [&_button]:opacity-70 hover:[&_button]:opacity-100";

function SectionHeader({ count }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-900/[0.06] bg-slate-50/50 px-[22px] py-4">
      <div className="flex items-center gap-[9px] text-sm font-bold tracking-tight text-primary">
        <div className="h-4 w-[3px] shrink-0 rounded-sm bg-gradient-to-b from-violet-500 to-fuchsia-500" />
        Volunteers
      </div>
      <div className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-violet-500/[0.12] px-[7px] text-[11px] font-bold text-violet-500/90">
        {count}
      </div>
    </div>
  );
}

function ViewModeTabs({ viewMode, onChange }) {
  const tabClass = (active) =>
    `flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[7px] border-0 px-3.5 py-[7px] text-[13px] font-semibold transition-all duration-fast ${
      active
        ? 'bg-white text-violet-500 shadow-[0_1px_4px_rgba(2,6,23,0.10)]'
        : 'bg-transparent text-muted hover:bg-white/60 hover:text-default'
    }`;

  return (
    <div className="flex items-center gap-3 px-[18px] pt-3">
      <div className="flex w-fit gap-1 rounded-[10px] bg-slate-900/5 p-1">
        <button type="button" className={tabClass(viewMode === 'all')} onClick={() => onChange('all')}>
          <Icon name="users" size={13} /> All Volunteers
        </button>
        <button type="button" className={tabClass(viewMode === 'by-event')} onClick={() => onChange('by-event')}>
          <Icon name="calendar" size={13} /> By Event
        </button>
      </div>
    </div>
  );
}

function EventPickerList({ pastEvents, onSelect }) {
  if (pastEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 px-[22px] py-11 text-center">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-violet-500/8 text-violet-500/50">
          <Icon name="calendar" size={22} />
        </div>
        <div className="text-[15px] font-semibold text-default">No completed events</div>
        <div className="max-w-[260px] text-[13px] leading-normal text-muted">
          Completed events with volunteers will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {pastEvents.map((evt) => (
        <div
          key={evt.id}
          className="group flex cursor-pointer items-center gap-3.5 rounded-[13px] border border-slate-900/8 bg-slate-50/60 px-[18px] py-3.5 transition-all duration-fast hover:translate-x-0.5 hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
          onClick={() => onSelect(evt)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-violet-500/[0.12] to-fuchsia-500/[0.08] text-violet-500/80">
            <Icon name="calendar" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-primary">{evt.title}</div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
              <span>{fmtDate(evt.start_date)}</span>
              {evt.venue && <><span>·</span><span>{evt.venue}</span></>}
            </div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-bold text-violet-500/90">
            <Icon name="users" size={11} /> volunteers
          </div>
          <div className="shrink-0 text-muted transition-transform duration-fast group-hover:translate-x-[3px]">
            <Icon name="arrowRight" size={16} />
          </div>
        </div>
      ))}
    </div>
  );
}

function VolunteersToolbar({ search, onSearchChange, sortBy, onSortChange, filterDept, onDeptChange, filterRated, onRatedChange, departments }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-900/[0.06] px-[18px] py-3">
      <div className="relative min-w-[160px] flex-1 [&_input]:box-border [&_input]:w-full [&_input]:rounded-[9px] [&_input]:border [&_input]:border-slate-900/12 [&_input]:bg-slate-50/80 [&_input]:py-2 [&_input]:pl-[34px] [&_input]:pr-3 [&_input]:font-sans [&_input]:text-[13px] [&_input]:text-primary [&_input]:outline-none [&_input]:transition-all [&_input]:duration-fast [&_input::placeholder]:text-muted [&_input:focus]:border-violet-500/40 [&_input:focus]:bg-white [&_input:focus]:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]">
        <div className="pointer-events-none absolute left-[11px] top-1/2 flex -translate-y-1/2 text-muted">
          <Icon name="search" size={14} />
        </div>
        <input
          type="text"
          placeholder="Search volunteers…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select className={toolbarSelectClass} value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="rating_desc">Highest Rated</option>
        <option value="rating_asc">Lowest Rated</option>
        <option value="name">Name A–Z</option>
        <option value="events">Most Events</option>
      </select>
      {departments.length > 0 && (
        <select className={toolbarSelectClass} value={filterDept} onChange={(e) => onDeptChange(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      <select className={toolbarSelectClass} value={filterRated} onChange={(e) => onRatedChange(e.target.value)}>
        <option value="all">All Ratings</option>
        <option value="rated">Rated Only</option>
        <option value="unrated">Not Yet Rated</option>
      </select>
    </div>
  );
}

function ResultsBar({ viewMode, selectedEvent, hasActiveFilters, search, filterDept, filterRated, onClearFilter, onBack, filteredCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/5 bg-slate-50/60 px-[18px] py-2 text-xs text-muted">
      <div className="flex items-center gap-2.5">
        {viewMode === 'by-event' && selectedEvent && (
          <>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 text-[13px] font-semibold text-violet-500/90 transition-opacity duration-fast hover:opacity-75"
              onClick={onBack}
            >
              <Icon name="arrowLeft" size={14} /> Back
            </button>
            <span className="font-semibold text-primary">{selectedEvent.title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5">
            {search && (
              <span className={filterChipClass}>
                "{search}" <button type="button" onClick={() => onClearFilter('search')}>×</button>
              </span>
            )}
            {filterDept && (
              <span className={filterChipClass}>
                {filterDept} <button type="button" onClick={() => onClearFilter('dept')}>×</button>
              </span>
            )}
            {filterRated !== 'all' && (
              <span className={filterChipClass}>
                {filterRated === 'rated' ? 'Rated only' : 'Not rated'}{' '}
                <button type="button" onClick={() => onClearFilter('rated')}>×</button>
              </span>
            )}
          </div>
        )}
        <span className="whitespace-nowrap text-xs text-muted">
          {filteredCount} volunteer{filteredCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}

export default function VolunteersSection({ allVolunteers, pastEvents, onRate }) {
  const [viewMode, setViewMode] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventVolunteers, setEventVolunteers] = useState([]);
  const [loadingEv, setLoadingEv] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [filterDept, setFilterDept] = useState('');
  const [filterRated, setFilterRated] = useState('all');

  const departments = useMemo(
    () => [...new Set(allVolunteers.map((v) => v.department).filter(Boolean))].sort(),
    [allVolunteers],
  );

  const handleSelectEvent = useCallback(async (evt) => {
    setSelectedEvent(evt);
    setLoadingEv(true);
    try {
      const data = await feedbackService.getEventVolunteers(evt.id);
      setEventVolunteers(Array.isArray(data) ? data : data?.data || []);
    } catch {
      useToastStore.getState().error('Failed to load volunteers for this event.');
      setEventVolunteers([]);
    } finally {
      setLoadingEv(false);
    }
  }, []);

  const handleViewMode = (mode) => {
    setViewMode(mode);
    setSelectedEvent(null);
    setEventVolunteers([]);
    setSearch('');
  };

  const source = viewMode === 'by-event' && selectedEvent ? eventVolunteers : allVolunteers;

  const filtered = useMemo(() => {
    let list = source;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((v) => (v.full_name || '').toLowerCase().includes(q));
    if (filterDept) list = list.filter((v) => v.department === filterDept);
    if (filterRated === 'rated') list = list.filter((v) => v.total_ratings > 0);
    if (filterRated === 'unrated') list = list.filter((v) => !v.total_ratings);
    return [...list].sort((a, b) => {
      if (sortBy === 'rating_desc') return (b.avg_rating || 0) - (a.avg_rating || 0);
      if (sortBy === 'rating_asc') return (a.avg_rating || 0) - (b.avg_rating || 0);
      if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '');
      if (sortBy === 'events') return (b.events_count || 0) - (a.events_count || 0);
      return 0;
    });
  }, [source, search, filterDept, filterRated, sortBy]);

  const hasActiveFilters = search || filterDept || filterRated !== 'all';
  const showGrid = viewMode === 'all' || (viewMode === 'by-event' && selectedEvent);

  const clearFilter = (key) => {
    if (key === 'search') setSearch('');
    if (key === 'dept') setFilterDept('');
    if (key === 'rated') setFilterRated('all');
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-900/8 bg-white shadow-[0_4px_16px_rgba(2,6,23,0.04)]">
      <SectionHeader count={filtered.length} />
      <ViewModeTabs viewMode={viewMode} onChange={handleViewMode} />

      {viewMode === 'by-event' && !selectedEvent && (
        <EventPickerList pastEvents={pastEvents} onSelect={handleSelectEvent} />
      )}

      {showGrid && (
        <VolunteersToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterDept={filterDept}
          onDeptChange={setFilterDept}
          filterRated={filterRated}
          onRatedChange={setFilterRated}
          departments={departments}
        />
      )}

      {showGrid && (viewMode === 'by-event' || hasActiveFilters) && (
        <ResultsBar
          viewMode={viewMode}
          selectedEvent={selectedEvent}
          hasActiveFilters={hasActiveFilters}
          search={search}
          filterDept={filterDept}
          filterRated={filterRated}
          onClearFilter={clearFilter}
          onBack={() => setSelectedEvent(null)}
          filteredCount={filtered.length}
        />
      )}

      {viewMode === 'by-event' && selectedEvent && loadingEv && (
        <div className="flex justify-center p-8"><Spinner size="sm" /></div>
      )}

      {showGrid && !loadingEv && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-sm text-muted">
            <Icon name="search" size={28} />
            <div className="mt-1 font-semibold text-default">No volunteers found</div>
            <div className="text-[13px]">Try adjusting your search or filters.</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3.5 p-[18px]">
            {filtered.map((v) => (
              <VolunteerCard key={v.id} volunteer={v} onRate={onRate} roleName={v.role_name} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
