import Topbar from '../../../components/layout/Topbar.jsx';
import { PageSpinner } from '../../../components/ui/Spinner.jsx';
import { ConfirmModal } from '../../../components/ui/Modal.jsx';
import { pageContent } from '../../../components/layout/layoutClasses.js';
import { fmtDate, fmtTime } from './constants.js';
import { useEventDetail } from './useEventDetail.js';
import EventDetailHeader from './EventDetailHeader.jsx';
import EventDetailHero from './EventDetailHero.jsx';
import EventDetailMainColumn from './EventDetailMainColumn.jsx';
import EventDetailSidebar from './EventDetailSidebar.jsx';
import BuyTicketModal from './BuyTicketModal.jsx';
import ShareEventModal from './ShareEventModal.jsx';
import ReassignOrganizerModal from './ReassignOrganizerModal.jsx';

export default function EventDetailPage() {
  const d = useEventDetail();
  const {
    id, event, loading, confirmDelete, setConfirmDelete, confirmCancel, setConfirmCancel,
    confirmStatus, setConfirmStatus, showReassign, setShowReassign, organizers,
    reassignLoading, selectedOrganizerId, setSelectedOrganizerId,
    needs, myApplication, applyingNeedId, ticketTypes, myTicket,
    buyingTypeId, paymentType, setPaymentType, showBuyModal, setShowBuyModal,
    paymentMethods, paymentReference, setPaymentReference, selectedMethodId, setSelectedMethodId,
    eventFeedback, qrPreview, setQrPreview, qrDownloading, setQrDownloading,
    showShareModal, setShowShareModal, linkCopied, setLinkCopied,
    canManage, isAdmin, isVolunteer, isAttendee, nextStatus,
    handleApply, handleBuyTicket, openReassign, handleReassign,
    handleAdvanceStatus, handleCancel, handleDelete, toast,
  } = d;

  if (loading) return (
    <>
      <Topbar />
      <div className={pageContent}><PageSpinner /></div>
    </>
  );

  if (!event) return null;

  const startDate = fmtDate(event.start_date);
  const startTime = fmtTime(event.start_date);
  const endDate = fmtDate(event.end_date);
  const endTime = fmtTime(event.end_date);
  const venueRaw = event.venue || event.location || '';
  const isOnline = /^https?:\/\//i.test(venueRaw);
  const venue = venueRaw || 'Not specified';
  const attendeeCap = event.max_attendees ? `${event.max_attendees} seats` : 'Unlimited';
  const volunteerCap = event.max_volunteers ? `${event.max_volunteers} spots` : 'Unlimited';
  const dateRange = startDate === endDate ? startDate : `${startDate} – ${endDate}`;

  // Pick the right live countdown for the current event status.
  // - draft/published → counts down to start (cyan, "starts in")
  // - ongoing → counts down to end (amber, "ends in")
  // - completed/cancelled → no countdown
  let countdownConfig = null;
  if ((event.status === 'published' || event.status === 'draft') && event.start_date && new Date(event.start_date) > new Date()) {
    countdownConfig = {
      target: event.start_date,
      variant: 'starts',
      title: 'Event starts in',
      sub: `${startDate}${startTime ? ' · ' + startTime : ''}`,
    };
  } else if (event.status === 'ongoing' && event.end_date && new Date(event.end_date) > new Date()) {
    countdownConfig = {
      target: event.end_date,
      variant: 'ends',
      title: 'Event ends in',
      sub: `Closes ${endDate}${endTime ? ' · ' + endTime : ''}`,
    };
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className="w-full">
          <div className="w-full overflow-hidden rounded-[22px] border border-slate-900/8 bg-white/72 shadow-[0_18px_40px_rgba(2,6,23,0.06)]">
            <EventDetailHeader
              id={id}
              canManage={canManage}
              nextStatus={nextStatus}
              event={event}
              onShare={() => setShowShareModal(true)}
              onConfirmCancel={() => setConfirmCancel(true)}
              onConfirmDelete={() => setConfirmDelete(true)}
              onConfirmStatus={() => setConfirmStatus(true)}
            />
            <EventDetailHero
              event={event}
              countdownConfig={countdownConfig}
              dateRange={dateRange}
              startDate={startDate}
              startTime={startTime}
              endDate={endDate}
              endTime={endTime}
              venueRaw={venueRaw}
              isOnline={isOnline}
              venue={venue}
              attendeeCap={attendeeCap}
              volunteerCap={volunteerCap}
            />
            <div className="p-[22px]">
              <div className="grid grid-cols-[2fr_1fr] items-start gap-5 max-[900px]:!grid-cols-1">
                <EventDetailMainColumn event={event} eventFeedback={eventFeedback} />
                <EventDetailSidebar
                  event={event}
                  isVolunteer={isVolunteer}
                  isAttendee={isAttendee}
                  isAdmin={isAdmin}
                  needs={needs}
                  myApplication={myApplication}
                  applyingNeedId={applyingNeedId}
                  ticketTypes={ticketTypes}
                  myTicket={myTicket}
                  qrPreview={qrPreview}
                  setQrPreview={setQrPreview}
                  qrDownloading={qrDownloading}
                  setQrDownloading={setQrDownloading}
                  onApply={handleApply}
                  onBuyTicket={(tt) => { setShowBuyModal(tt); setPaymentType('cash'); }}
                  onReassign={openReassign}
                />
              </div>
              <ConfirmModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                title="Delete Event"
                message={`Delete "${event.title}" permanently? All related data will be removed.`}
                confirmText="Delete"
                danger
              />
              <ConfirmModal
                isOpen={confirmCancel}
                onClose={() => setConfirmCancel(false)}
                onConfirm={handleCancel}
                title="Cancel Event"
                message={`Cancel "${event.title}"? Volunteers and ticket holders will be notified. This can't be reverted.`}
                confirmText="Cancel Event"
                danger
              />
              <ConfirmModal
                isOpen={confirmStatus}
                onClose={() => setConfirmStatus(false)}
                onConfirm={handleAdvanceStatus}
                title="Update Status"
                message={`Advance event status from "${event.status}" to "${nextStatus}"?`}
                confirmText="Confirm"
              />
              <BuyTicketModal
                ticketType={showBuyModal}
                event={event}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                paymentMethods={paymentMethods}
                paymentReference={paymentReference}
                setPaymentReference={setPaymentReference}
                selectedMethodId={selectedMethodId}
                setSelectedMethodId={setSelectedMethodId}
                buyingTypeId={buyingTypeId}
                onClose={() => { setShowBuyModal(null); setPaymentReference(''); setSelectedMethodId(null); }}
                onConfirm={handleBuyTicket}
              />
              <ShareEventModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                event={event}
                linkCopied={linkCopied}
                onCopyLink={handleCopyLink}
              />
              <ReassignOrganizerModal
                open={showReassign}
                event={event}
                organizers={organizers}
                selectedOrganizerId={selectedOrganizerId}
                setSelectedOrganizerId={setSelectedOrganizerId}
                reassignLoading={reassignLoading}
                onClose={() => setShowReassign(false)}
                onConfirm={handleReassign}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
