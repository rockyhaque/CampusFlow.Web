import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../../components/layout/Topbar.jsx';
import { PageSpinner } from '../../../components/ui/Spinner.jsx';
import { eventsService } from '../../../services/events.service.js';
import useToastStore from '../../../stores/useToastStore.js';
import Icon from '../../../components/ui/Icon.jsx';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../../components/layout/layoutClasses.js';
import { btnGhost, btnSecondarySm } from '../../../components/ui/componentClasses.js';
import { TABS } from './constants.js';
import VolunteersTab from './VolunteersTab.jsx';
import TicketsTab from './TicketsTab.jsx';
import AttendanceTab from './AttendanceTab.jsx';

export default function EventManagePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('volunteers');
  const navigate = useNavigate();

  useEffect(() => {
    eventsService.getEvent(id)
      .then((r) => setEvent(r.data))
      .catch(() => { useToastStore.getState().error('Event not found.'); navigate('/events'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <>
      <Topbar />
      <div className={pageContent}><PageSpinner /></div>
    </>
  );

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>{event?.title || ''}</div>
            <div className={pageSubtitle}>Volunteers · Tickets · Attendance</div>
          </div>
        </div>
        <div className="mb-5 flex flex-wrap gap-2.5">
          <button className={btnSecondarySm} onClick={() => navigate(`/events/${id}`)}>
            <Icon name="arrowLeft" size={14} /> Back to Event
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-0.5 border-b border-border-subtle">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
            <button
              key={t.key}
              className={`${btnGhost} rounded-t-lg border-b-2 px-4 py-2 ${active ? 'border-b-accent font-semibold text-accent' : 'border-b-transparent font-normal text-muted'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
            );
          })}
        </div>

        {tab === 'volunteers' && <VolunteersTab eventId={id} eventStatus={event?.status} />}
        {tab === 'tickets' && <TicketsTab eventId={id} />}
        {tab === 'attendance' && <AttendanceTab eventId={id} />}
      </div>
    </>
  );
}
