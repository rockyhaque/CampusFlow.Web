import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { dashboardService } from '../../services/dashboard.service.js';
import Icon from '../../components/ui/Icon.jsx';
import { ChartCard, AreaTrend, PieBreakdown, BarSeries, CHART_COLORS } from '../../components/ui/Charts.jsx';
import { chartsGrid, pageContent, pageHeader, pageSubtitle, pageTitle, statsGrid } from '../../components/layout/layoutClasses.js';
import { btnSecondarySm, card, cardHeader, cardTitle, tableWrap, tdMuted, tdPrimary } from '../../components/ui/componentClasses.js';
import {
  cardMt,
  chartStatCaption,
  chartStatCenter,
  chartStatValueGreen,
  dashStagger,
  dashboardError,
  dashboardErrorRetry,
  dashboardLoaded,
  progressBarFill,
  progressBarTrack,
} from './dashboardClasses.js';
import { cfProgress } from '../../utils/cfDynamic.js';

const fmtMonth = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

export default function AttendeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboard = useCallback(() => {
    setLoading(true);
    setError(null);
    dashboardService.attendeeDashboard()
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={pageContent}><PageSpinner /></div>
      </>
    );
  }

  if (error) {
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

  if (!data) return null;

  const t = data.tickets || {};
  const attendanceRate = t.total > 0 ? Math.round((t.attended / t.total) * 100) : 0;
  const monthlyTickets = (data.monthlyTickets || []).map((m) => ({
    month: fmtMonth(m.month),
    count: m.count,
    spent: m.spent,
  }));
  const categoryPie = (data.byCategory || []).map((c) => ({ name: c.category, value: c.count }));

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${dashboardLoaded}`}>
        <header className={pageHeader}>
          <div>
            <h1 className={pageTitle}>Dashboard</h1>
            <p className={pageSubtitle}>Your event activity overview</p>
          </div>
        </header>

        <div className={statsGrid}>
          <StatCard icon={<Icon name="ticket" size={22} />} label="Tickets" value={t.total || 0} color="cyan" className="dashboard-enter" style={dashStagger(0).style} />
          <StatCard
            icon={<Icon name="checkCircle" size={22} />}
            label="Attended"
            value={t.attended || 0}
            sub={`${attendanceRate}% attendance rate`}
            color="green"
            className="dashboard-enter"
            style={dashStagger(1).style}
          />
          <StatCard icon={<Icon name="trophy" size={22} />} label="Total Spent" value={`${(data.totalSpent || 0).toFixed(0)} ৳`} color="amber" className="dashboard-enter" style={dashStagger(2).style} />
          <StatCard icon={<Icon name="star" size={22} />} label="Reviews Given" value={data.feedbackGiven} color="purple" className="dashboard-enter" style={dashStagger(3).style} />
        </div>

        <div className={chartsGrid}>
          <ChartCard title="Tickets Bought" subtitle="Last 6 months" empty={monthlyTickets.length === 0 ? 'No tickets purchased yet' : null} className="dashboard-section-enter" style={dashStagger(1).style}>
            <BarSeries data={monthlyTickets} xKey="month" yKey="count" color={CHART_COLORS.cyan} valueLabel="Tickets" />
          </ChartCard>

          <ChartCard title="Spending Trend" subtitle="Last 6 months · BDT" empty={monthlyTickets.length === 0 ? 'No spending recorded yet' : null} className="dashboard-section-enter" style={dashStagger(2).style}>
            <AreaTrend data={monthlyTickets} xKey="month" yKey="spent" color={CHART_COLORS.amber} valueLabel="৳" />
          </ChartCard>

          <ChartCard title="Events by Category" subtitle="Where you spend your time" empty={categoryPie.length === 0 ? 'Attend events to see your taste profile' : null} className="dashboard-section-enter" style={dashStagger(3).style}>
            <PieBreakdown data={categoryPie} />
          </ChartCard>

          <ChartCard
            title="Attendance Rate"
            subtitle={`${t.attended || 0} of ${t.total || 0} tickets used`}
            empty={!t.total ? 'Buy a ticket to track this' : null}
            className="dashboard-section-enter"
            style={dashStagger(4).style}
          >
            {t.total > 0 && (
              <div className={chartStatCenter}>
                <div className={chartStatValueGreen} aria-label={`Attendance rate ${attendanceRate} percent`}>
                  {attendanceRate}%
                </div>
                <div
                  className={progressBarTrack}
                  role="progressbar"
                  aria-valuenow={attendanceRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Ticket attendance rate"
                >
                  <div className={progressBarFill} style={cfProgress(attendanceRate)} />
                </div>
                <p className={chartStatCaption}>
                  {t.attended} attended / {t.total - t.attended} no-show
                </p>
              </div>
            )}
          </ChartCard>
        </div>

        {data.recentAttendance?.length > 0 && (
          <section className={`${card} ${cardMt} dashboard-section-enter`} style={dashStagger(5).style} aria-labelledby="attendee-recent-checkins">
            <div className={cardHeader}>
              <h2 id="attendee-recent-checkins" className={cardTitle}>Recent check-ins</h2>
              <button type="button" className={btnSecondarySm} onClick={() => navigate('/my-tickets')}>My Tickets</button>
            </div>
            <div className={tableWrap}>
              <table>
                <thead><tr><th scope="col">Event</th><th scope="col">Checked In</th><th scope="col">Checked Out</th></tr></thead>
                <tbody>
                  {data.recentAttendance.map((a, i) => (
                    <tr key={i}>
                      <td className={tdPrimary}>{a.event_title}</td>
                      <td className={tdMuted}>
                        {a.check_in_time ? new Date(a.check_in_time).toLocaleString() : '—'}
                      </td>
                      <td className={tdMuted}>
                        {a.check_out_time ? new Date(a.check_out_time).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
