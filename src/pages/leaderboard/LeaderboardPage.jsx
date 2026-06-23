import Topbar from '../../components/layout/Topbar.jsx';
import Icon from '../../components/ui/Icon.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  card,
  cardTitle,
  inputSelect,
  tableWrap,
} from '../../components/ui/componentClasses.js';
import StatCard from '../../components/ui/StatCard.jsx';
import LeaderboardPagination from './LeaderboardPagination.jsx';
import LeaderboardRow from './LeaderboardRow.jsx';
import PodiumItem from './PodiumItem.jsx';
import VolunteerDetailModal from './VolunteerDetailModal.jsx';
import { PAGE_SIZE } from './constants.js';
import {
  leaderboardError,
  leaderboardErrorRetry,
  leaderboardLoaded,
  leaderboardStatsGrid,
  lbStagger,
  myRankBadge,
  myRankLabel,
  myRankValue,
  podiumCard,
  podiumGrid,
  rankingToolbar,
} from './leaderboardClasses.js';
import { useLeaderboard } from './useLeaderboard.js';

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading leaderboard">
      <div className={`${pageHeader} animate-pulse`}>
        <div>
          <div className="mb-2 h-8 w-64 rounded-md bg-surface-2" />
          <div className="h-4 w-96 max-w-full rounded-md bg-surface-2" />
        </div>
      </div>
      <div className={leaderboardStatsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border-subtle bg-surface px-[18px] py-4">
            <div className="mb-3 h-8 w-8 rounded-lg bg-surface-2" />
            <div className="mb-2 h-7 w-16 rounded-md bg-surface-2" />
            <div className="h-3 w-20 rounded-md bg-surface-2" />
          </div>
        ))}
      </div>
      <div className={`${podiumCard} animate-pulse`}>
        <div className="mx-auto mb-6 h-5 w-32 rounded-md bg-surface-2" />
        <div className="mx-auto flex max-w-[480px] items-end justify-center gap-4">
          {[60, 88, 48].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-surface-2" />
              <div className="h-3 w-20 rounded-md bg-surface-2" />
              <div className="h-2 w-full rounded-t-xl bg-surface-2" style={{ height: h }} />
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} overflow-hidden !p-0 animate-pulse`}>
        <div className="border-b border-border-subtle px-5 py-4">
          <div className="h-9 w-full max-w-md rounded-md bg-surface-2" />
        </div>
        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-surface-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PodiumSection({ podium, ratedOnly, userId }) {
  const podiumOrder = [2, 1, 3];

  return (
    <section
      className={`${podiumCard} leaderboard-section-enter`}
      style={lbStagger(1).style}
      aria-labelledby="podium-heading"
    >
      <h2 id="podium-heading" className={`${cardTitle} mb-5 text-center`}>
        Top performers
      </h2>
      <div className={podiumGrid}>
        {podiumOrder.map((rank, index) => (
          <PodiumItem
            key={rank}
            rank={rank}
            item={podium[rank - 1] ?? null}
            isMe={podium[rank - 1]?.volunteer_id === userId}
            staggerIndex={index}
          />
        ))}
      </div>
      {ratedOnly.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted">
          No ratings yet — the podium will fill in once organizers and attendees submit ratings.
        </p>
      )}
    </section>
  );
}

export default function LeaderboardPage() {
  const {
    user,
    data,
    loading,
    error,
    loadLeaderboard,
    search,
    setSearch,
    filter,
    setFilter,
    detailId,
    setDetailId,
    setPage,
    ratedOnly,
    podium,
    stats,
    filtered,
    totalPages,
    currentPage,
    pageStart,
    pagedList,
    myRank,
    rankOf,
  } = useLeaderboard();

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={pageContent}><LeaderboardSkeleton /></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar />
        <div className={pageContent}>
          <div className={leaderboardError} role="alert">
            <Icon name="warning" size={16} />
            <span>{error}</span>
            <button type="button" className={leaderboardErrorRetry} onClick={loadLeaderboard}>
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${leaderboardLoaded}`}>
        <header className={`${pageHeader} leaderboard-enter`} style={lbStagger(0).style}>
          <div>
            <h1 className={pageTitle}>Volunteer Leaderboard</h1>
            <p className={pageSubtitle}>
              Campus-wide rankings based on average rating. More reviews help volunteers climb the ranks.
            </p>
          </div>
          {myRank > 0 && (
            <div className={myRankBadge} aria-label={`Your rank: number ${myRank}`}>
              <div className={myRankLabel}>Your rank</div>
              <div className={myRankValue}>#{myRank}</div>
            </div>
          )}
        </header>

        <div className="flex flex-col gap-6">
          <div className={leaderboardStatsGrid}>
            <StatCard variant="big" icon="users" theme="violet" label="Total volunteers" value={stats.totalVolunteers} sub="active" className="leaderboard-enter" style={lbStagger(0).style} />
            <StatCard variant="big" icon="star" theme="amber" label="Rated volunteers" value={stats.ratedCount} sub={`of ${stats.totalVolunteers}`} className="leaderboard-enter" style={lbStagger(1).style} />
            <StatCard variant="big" icon="trophy" theme="pink" label="Avg rating" value={stats.avgOfAvgs ?? '—'} sub="across rated" className="leaderboard-enter" style={lbStagger(2).style} />
            <StatCard variant="big" icon="clipboard" theme="blue" label="Total reviews" value={stats.totalRatings} sub="submitted" className="leaderboard-enter" style={lbStagger(3).style} />
          </div>

          <PodiumSection podium={podium} ratedOnly={ratedOnly} userId={user?.id} />

          <section className={`${card} overflow-hidden !p-0 leaderboard-section-enter`} style={lbStagger(2).style} aria-labelledby="ranking-heading">
            <div className={rankingToolbar}>
              <h2 id="ranking-heading" className={cardTitle}>Full ranking</h2>
              <SearchInput
                className="min-w-[200px] max-w-[320px] flex-[1_1_220px]"
                placeholder="Search by name…"
                ariaLabel="Search volunteers by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label htmlFor="leaderboard-filter" className="sr-only">
                Filter volunteers
              </label>
              <select
                id="leaderboard-filter"
                className={`${inputSelect} ml-auto h-9 w-40 text-[13px] max-[900px]:min-h-11`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All volunteers</option>
                <option value="rated">Rated only</option>
                <option value="unrated">Not yet rated</option>
              </select>
              <span className="whitespace-nowrap text-xs text-muted" aria-live="polite">
                {filtered.length} of {data.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                className="px-5 py-10"
                icon="trophy"
                iconSize={36}
                title="No volunteers match"
                description="Try adjusting your search or filter."
              />
            ) : (
              <div className={tableWrap}>
                <table>
                  <caption className="sr-only">
                    Volunteer leaderboard ranked by average rating
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="w-14">Rank</th>
                      <th scope="col">Volunteer</th>
                      <th scope="col">Department</th>
                      <th scope="col">Rating</th>
                      <th scope="col" className="text-right">Reviews</th>
                      <th scope="col" className="text-right">Events</th>
                      <th scope="col" className="text-right">Hours</th>
                      <th scope="col" className="text-right"><span className="sr-only">Actions</span>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedList.map((item, index) => (
                      <LeaderboardRow
                        key={item.volunteer_id}
                        item={item}
                        rank={rankOf(item.volunteer_id)}
                        isMe={user?.id === item.volunteer_id}
                        onView={() => setDetailId(item.volunteer_id)}
                        staggerIndex={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length > PAGE_SIZE && (
              <LeaderboardPagination
                page={currentPage}
                totalPages={totalPages}
                pageStart={pageStart}
                pageEnd={Math.min(pageStart + PAGE_SIZE, filtered.length)}
                total={filtered.length}
                onChange={setPage}
              />
            )}
          </section>
        </div>
      </div>

      {detailId && (
        <VolunteerDetailModal volunteerId={detailId} onClose={() => setDetailId(null)} />
      )}
    </>
  );
}
