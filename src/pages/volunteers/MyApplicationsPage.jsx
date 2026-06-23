import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { volunteersService } from '../../services/volunteers.service.js';
import { feedbackService } from '../../services/feedback.service.js';
import useToastStore from '../../stores/useToastStore.js';
import Icon from '../../components/ui/Icon.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import RatingModal from '../../components/ui/RatingModal.jsx';
import { fmtDate } from '../../utils/format.js';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  btnGhostSm,
  btnPrimarySm,
  btnSuccessSm,
  tableMeta,
  tableRowActions,
  tableSubtext,
  tableWrap,
  tdPrimary,
} from '../../components/ui/componentClasses.js';

const statusColor = { approved: 'green', rejected: 'red', pending: 'amber' };

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null); // { eventId, eventTitle, organizerId, organizerName }
  const navigate = useNavigate();

  useEffect(() => {
    volunteersService.getMyApplications()
      .then((r) => setApps(r.data || []))
      .catch(() => useToastStore.getState().error('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>My Applications</div>
            <div className={pageSubtitle}>Your volunteer event applications · {apps.length} total</div>
          </div>
          <button className={btnPrimarySm} onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>

        {loading ? <PageSpinner /> : apps.length === 0 ? (
          <EmptyState
            icon="clipboard"
            title="No applications yet"
            description="Browse events and apply to volunteer roles."
          />
        ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className={tdPrimary}>
                        {app.event_title || 'Unknown Event'}
                      </div>
                      <div className={tableSubtext}>
                        {app.event_date ? fmtDate(app.event_date) : ''}
                      </div>
                    </td>
                    <td className={tableMeta}>
                      {app.role_name || '—'}
                    </td>
                    <td>
                      <Badge label={app.status} color={statusColor[app.status] || 'slate'} />
                    </td>
                    <td className={tableMeta}>
                      {fmtDate(app.applied_at || app.created_at)}
                    </td>
                    <td>
                      <div className={tableRowActions}>
                        {/* Rate Organizer — approved volunteers can rate after the event completes */}
                        {app.status === 'approved' && app.event_status === 'completed' && app.organizer_id && (
                          <button
                            className={btnSuccessSm}
                            onClick={() => setRating({
                              eventId: app.event_id,
                              eventTitle: app.event_title,
                              organizerId: app.organizer_id,
                              organizerName: app.organizer_name,
                            })}
                          >
                            <Icon name="star" size={13} /> Rate Organizer
                          </button>
                        )}
                        {app.event_id && (
                          <button
                            className={btnGhostSm}
                            onClick={() => navigate(`/events/${app.event_id}`)}
                          >
                            View Event
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rating && (
          <RatingModal
            title={`Rate ${rating.organizerName || 'the organizer'}`}
            subtitle={`How was your experience volunteering for "${rating.eventTitle}"?`}
            onClose={() => setRating(null)}
            onSubmit={(payload) => feedbackService.rateOrganizer(rating.eventId, rating.organizerId, payload)}
            submitLabel="Submit Rating"
          />
        )}
      </div>
    </>
  );
}
