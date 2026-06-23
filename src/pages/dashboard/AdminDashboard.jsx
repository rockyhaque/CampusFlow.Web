import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { dashboardService } from '../../services/dashboard.service.js';
import useAuthStore from '../../stores/useAuthStore.js';
import Icon from '../../components/ui/Icon.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { fmtDate } from '../../utils/format.js';
import { ChartCard, PieBreakdown, AreaTrend, CHART_COLORS } from '../../components/ui/Charts.jsx';
import { chartsGridMb, pageContent, pageHeader, pageSubtitle, pageTitle, statsGrid, statsGridInner } from '../../components/layout/layoutClasses.js';
import { btnPrimarySm, btnSecondarySm, card, cardHeader, cardSubtitle, cardTitle, tableRowClickable, tableSubtext, tableThRight, tableWrap, tdMuted, tdPrimary, tdRank, tdRight, textMuted13 } from '../../components/ui/componentClasses.js';
import {
  cardSubtitleMb,
  dashStagger,
  dashboardError,
  dashboardErrorRetry,
  dashboardLoaded,
  dashboardSection,
  rowNavProps,
  sectionLabel,
  sectionWrap,
  summarizeSeries,
  systemMetricsCard,
  systemMetricsHeader,
  systemMetricsTitle,
} from './dashboardClasses.js';
import { DashboardStatsSkeleton } from './DashboardSkeleton.jsx';
import DeferredSection from './DeferredSection.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const loadDashboard = useCallback(() => {
    setLoading(true);
    setError(null);
    dashboardService.adminDashboard()
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const fullName = user?.fullName || user?.full_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${data ? dashboardLoaded : ''}`}>
        <header className={pageHeader}>
          <div>
            <h1 className={pageTitle}>Dashboard</h1>
            <p className={pageSubtitle}>{greeting}, {fullName}</p>
          </div>
        </header>

        {loading && <DashboardStatsSkeleton count={6} />}

        {error && !loading && (
          <div className={dashboardError} role="alert">
            <Icon name="warning" size={16} />
            <span>{error}</span>
            <button type="button" className={dashboardErrorRetry} onClick={loadDashboard}>
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            <div className={statsGrid}>
              <StatCard icon={<Icon name="users" size={22} />} label="Total Users" value={Number(data.users?.total ?? 0).toLocaleString()} color="cyan" />
              <StatCard icon={<Icon name="calendar" size={22} />} label="Total Events" value={Number(data.events?.total ?? 0).toLocaleString()} color="green" />
              <StatCard icon={<Icon name="ticket" size={22} />} label="Tickets Sold" value={Number(data.tickets?.total_tickets ?? 0).toLocaleString()} color="amber" />
              <StatCard icon={<Icon name="award" size={22} />} label="Volunteers" value={Number(data.users?.volunteers ?? 0).toLocaleString()} color="green" />
              <StatCard icon={<Icon name="clock" size={22} />} label="Pending Approvals" value={Number(data.users?.pending_organizers ?? 0)} color={Number(data.users?.pending_organizers) > 0 ? 'amber' : 'cyan'} sub={Number(data.users?.pending_organizers) > 0 ? 'Organizers awaiting approval' : undefined} />
              <StatCard icon={<Icon name="trophy" size={22} />} label="Revenue" value={`${Number(data.revenue ?? 0).toFixed(2)} ৳`} color="amber" />
            </div>

            <section className={`${systemMetricsCard} ${dashboardSection} dashboard-section-enter`} style={dashStagger(0).style} aria-labelledby="admin-system-metrics">
              <div className={systemMetricsHeader}>
                <Icon name="shield" size={18} color="var(--purple-400)" aria-hidden />
                <h2 id="admin-system-metrics" className={systemMetricsTitle}>System metrics</h2>
              </div>
              <p className={cardSubtitleMb}>Platform-wide stats</p>

              <div className={statsGridInner}>
                <StatCard icon={<Icon name="users" size={22} />} label="Active Users" value={data.active_users} color="cyan" />
                <StatCard icon={<Icon name="spark" size={22} />} label="Signups (30d)" value={data.signups_30d} color="green" />
                <StatCard icon={<Icon name="trophy" size={22} />} label="Revenue (30d)" value={`${Number(data.revenue_30d).toFixed(2)} ৳`} color="amber" />
                <StatCard icon={<Icon name="checkCircle" size={22} />} label="Attendance Rate" value={`${data.attendance_rate}%`} sub={`${data.checked_in_tickets} of ${data.confirmed_tickets} tickets`} color="green" />
                <StatCard icon={<Icon name="shield" size={22} />} label="Admins" value={data.admin_count} color="purple" />
              </div>

              {data.top_organizers?.length > 0 && (
                <div className={sectionWrap}>
                  <h3 className={sectionLabel}>Top organizers by event count</h3>
                  <div className={tableWrap}>
                    <table>
                      <thead>
                        <tr><th scope="col">#</th><th scope="col">Organizer</th><th scope="col">Email</th><th scope="col" className={tableThRight}>Events</th></tr>
                      </thead>
                      <tbody>
                        {data.top_organizers.map((o, i) => (
                          <tr
                            key={o.id}
                            className={tableRowClickable}
                            {...rowNavProps(navigate, `/users/${o.id}`)}
                          >
                            <td className={tdRank}>{i + 1}</td>
                            <td className={tdPrimary}>{o.full_name || '—'}</td>
                            <td className={tdMuted}>{o.email}</td>
                            <td className={tdRight}>
                              <Badge label={`${o.event_count}`} color="cyan" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <DeferredSection
              minHeight={320}
              fallback={<div className={`${chartsGridMb} animate-pulse`}><div className="h-[320px] rounded-lg bg-surface-2" /></div>}
            >
            <div className={chartsGridMb}>
              {data.events && (() => {
                const eventsPie = [
                  { name: 'Published', value: parseInt(data.events.published) || 0 },
                  { name: 'Ongoing', value: parseInt(data.events.ongoing) || 0 },
                  { name: 'Completed', value: parseInt(data.events.completed) || 0 },
                  { name: 'Draft', value: parseInt(data.events.draft) || 0 },
                  { name: 'Cancelled', value: parseInt(data.events.cancelled) || 0 },
                ].filter((s) => s.value > 0);
                return (
                  <ChartCard title="Event Status" subtitle="Across the platform" empty={eventsPie.length === 0 ? 'No events yet' : null} className="dashboard-section-enter" style={dashStagger(1).style} dataSummary={summarizeSeries(eventsPie)}>
                    <PieBreakdown data={eventsPie} colors={[CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.slate, CHART_COLORS.amber, CHART_COLORS.red]} />
                  </ChartCard>
                );
              })()}

              {data.users && (() => {
                const usersPie = [
                  { name: 'Volunteers', value: parseInt(data.users.volunteers) || 0 },
                  { name: 'Organizers', value: parseInt(data.users.organizers) || 0 },
                  { name: 'Attendees', value: parseInt(data.users.attendees) || 0 },
                ].filter((s) => s.value > 0);
                return (
                  <ChartCard title="User Distribution" subtitle="By role" empty={usersPie.length === 0 ? 'No users yet' : null} className="dashboard-section-enter" style={dashStagger(2).style} dataSummary={summarizeSeries(usersPie)}>
                    <PieBreakdown data={usersPie} colors={[CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.amber]} />
                  </ChartCard>
                );
              })()}

              {data.growth_weekly?.length > 0 && (() => {
                const weekly = data.growth_weekly.map((g) => ({
                  week: new Date(g.week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                  signups: g.count,
                }));
                return (
                  <ChartCard title="User Growth" subtitle="New signups · last 8 weeks" className="dashboard-section-enter" style={dashStagger(3).style} dataSummary={summarizeSeries(weekly, { nameKey: 'week', valueKey: 'signups' })}>
                    <AreaTrend data={weekly} xKey="week" yKey="signups" color={CHART_COLORS.purple} valueLabel="Signups" />
                  </ChartCard>
                );
              })()}
            </div>
            </DeferredSection>

            {data.recentEvents?.length > 0 ? (
              <section className={`${card} dashboard-section-enter`} style={dashStagger(4).style} aria-labelledby="admin-recent-events">
                <div className={cardHeader}>
                  <div>
                    <h2 id="admin-recent-events" className={cardTitle}>Recent events</h2>
                    <p className={cardSubtitle}>Latest activity on the platform</p>
                  </div>
                  <button type="button" className={btnSecondarySm} onClick={() => navigate('/events')}>View all</button>
                </div>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Event</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEvents.map((ev) => (
                        <tr key={ev.id} className={tableRowClickable} {...rowNavProps(navigate, `/events/${ev.id}`)}>
                          <td>
                            <div className={tdPrimary}>{ev.title}</div>
                            <div className={tableSubtext}>{ev.location || 'No location'}</div>
                          </td>
                          <td><Badge label={ev.status} /></td>
                          <td>{fmtDate(ev.start_date)}</td>
                          <td><span className={textMuted13}>{ev.category || '—'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              <section className={`${card} dashboard-section-enter`} style={dashStagger(4).style}>
                <div className={cardHeader}>
                  <div>
                    <h2 className={cardTitle}>Events</h2>
                    <p className={cardSubtitle}>No events yet</p>
                  </div>
                  <button type="button" className={btnPrimarySm} onClick={() => navigate('/events/create')}>Create event</button>
                </div>
                <EmptyState
                  icon="calendar"
                  title="No events on the platform yet"
                  description="Organizers will create events once their accounts are approved."
                />
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
