import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { dashboardService } from '../../services/dashboard.service.js';
import Icon from '../../components/ui/Icon.jsx';
import { ChartCard, AreaTrend, PieBreakdown, BarSeries, CHART_COLORS } from '../../components/ui/Charts.jsx';
import { DashboardStatsSkeleton } from './DashboardSkeleton.jsx';
import DeferredSection from './DeferredSection.jsx';
import { chartsGrid, pageContent, pageHeader, pageSubtitle, pageTitle, statsGrid } from '../../components/layout/layoutClasses.js';
import { btnSecondarySm, card, cardHeader, cardTitle } from '../../components/ui/componentClasses.js';
import {
  activityItem,
  activityItemMain,
  activityItemSub,
  activityItemTitle,
  activityList,
  cardMt,
  chartStatCaption,
  chartStatCenterLg,
  chartStatValueAmber,
  dashStagger,
  dashboardError,
  dashboardErrorRetry,
  dashboardLoaded,
} from './dashboardClasses.js';

const fmtMonth = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

export default function VolunteerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboard = useCallback(() => {
    setLoading(true);
    setError(null);
    dashboardService.volunteerDashboard()
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (error && !loading) {
    return (
      <>
        <Topbar />
        <div className={pageContent}>
          <div className={dashboardError} role="alert">
            <Icon name="warning" size={16} />
            <span>{error}</span>
            <button type="button" className={dashboardErrorRetry} onClick={loadDashboard}>Retry</button>
          </div>
        </div>
      </>
    );
  }

  const apps = data?.applications || {};
  const monthlyHours = (data?.monthlyHours || []).map((m) => ({ month: fmtMonth(m.month), hours: m.hours }));
  const monthlyApplications = (data?.monthlyApplications || []).map((m) => ({ month: fmtMonth(m.month), count: m.count }));
  const applicationPie = [
    { name: 'Approved', value: parseInt(apps.approved) || 0 },
    { name: 'Pending', value: parseInt(apps.pending) || 0 },
    { name: 'Rejected', value: parseInt(apps.rejected) || 0 },
  ].filter((s) => s.value > 0);

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${data ? dashboardLoaded : ''}`}>
        <header className={pageHeader}>
          <div>
            <h1 className={pageTitle}>Dashboard</h1>
            <p className={pageSubtitle}>Your volunteer journey at a glance</p>
          </div>
        </header>

        {loading && <DashboardStatsSkeleton count={4} />}

        {data && (
        <>
        <div className={statsGrid}>
          <StatCard icon={<Icon name="clipboard" size={22} />} label="Applications" value={apps.total} color="cyan" />
          <StatCard icon={<Icon name="checkCircle" size={22} />} label="Approved" value={apps.approved} color="green" />
          <StatCard icon={<Icon name="clock" size={22} />} label="Volunteer Hours" value={data.totalHours?.toFixed(1) || '0.0'} color="amber" />
          <StatCard
            icon={<Icon name="star" size={22} />}
            label="Avg Rating"
            value={data.averageRating > 0 ? data.averageRating.toFixed(1) : '—'}
            sub={data.totalRatings > 0 ? `${data.totalRatings} ratings` : 'No ratings yet'}
            color="amber"
          />
        </div>

        <DeferredSection minHeight={280} fallback={<div className="h-[280px] animate-pulse rounded-lg bg-surface-2" />}>
        <div className={chartsGrid}>
          <ChartCard title="Hours Volunteered" subtitle="Last 6 months" empty={monthlyHours.length === 0 ? 'No volunteer hours logged yet' : null} className="dashboard-section-enter" style={dashStagger(1).style}>
            <AreaTrend data={monthlyHours} xKey="month" yKey="hours" color={CHART_COLORS.amber} valueLabel="Hours" />
          </ChartCard>

          <ChartCard title="Applications Over Time" subtitle="Last 6 months" empty={monthlyApplications.length === 0 ? 'No applications yet' : null} className="dashboard-section-enter" style={dashStagger(2).style}>
            <BarSeries data={monthlyApplications} xKey="month" yKey="count" color={CHART_COLORS.cyan} valueLabel="Apps" />
          </ChartCard>

          <ChartCard title="Application Status" subtitle="All time" empty={applicationPie.length === 0 ? 'No applications yet' : null} className="dashboard-section-enter" style={dashStagger(3).style}>
            <PieBreakdown data={applicationPie} colors={[CHART_COLORS.green, CHART_COLORS.amber, CHART_COLORS.red]} />
          </ChartCard>

          <ChartCard
            title="Your Rating"
            subtitle={data.totalRatings > 0 ? `Based on ${data.totalRatings} reviews` : 'Earn ratings by volunteering'}
            empty={data.totalRatings === 0 ? 'No ratings yet — your first event will earn one' : null}
            height={240}
            className="dashboard-section-enter"
            style={dashStagger(4).style}
          >
            {data.totalRatings > 0 && (
              <div className={chartStatCenterLg}>
                <div className={chartStatValueAmber} aria-label={`Average rating ${data.averageRating.toFixed(1)} out of 5`}>
                  {data.averageRating.toFixed(1)}
                </div>
                <StarRating value={data.averageRating} size={28} showValue={false} />
                <p className={chartStatCaption}>
                  out of 5.0 · {data.totalRatings} {data.totalRatings === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            )}
          </ChartCard>
        </div>
        </DeferredSection>

        {data.recentActivity?.length > 0 && (
          <section className={`${card} ${cardMt} dashboard-section-enter`} style={dashStagger(5).style} aria-labelledby="volunteer-recent-activity">
            <div className={cardHeader}>
              <h2 id="volunteer-recent-activity" className={cardTitle}>Recent activity</h2>
              <button type="button" className={btnSecondarySm} onClick={() => navigate('/my-applications')}>View all</button>
            </div>
            <ul className={activityList}>
              {data.recentActivity.map((a, i) => (
                <li key={i} className={activityItem}>
                  <div className={activityItemMain}>
                    <div className={activityItemTitle}>{a.event_title}</div>
                    <div className={activityItemSub}>
                      Applied {new Date(a.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge label={a.status} />
                </li>
              ))}
            </ul>
          </section>
        )}
        </>
        )}
      </div>
    </>
  );
}
