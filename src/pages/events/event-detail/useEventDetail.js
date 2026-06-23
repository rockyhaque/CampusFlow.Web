import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../../../services/events.service.js';
import { usersService } from '../../../services/users.service.js';
import { volunteersService } from '../../../services/volunteers.service.js';
import { ticketsService } from '../../../services/tickets.service.js';
import { paymentMethodsService } from '../../../services/paymentMethods.service.js';
import { feedbackService } from '../../../services/feedback.service.js';
import useAuthStore from '../../../stores/useAuthStore.js';
import useToastStore from '../../../stores/useToastStore.js';
import { STATUS_FLOW, CAN_MANAGE } from './constants.js';

export function useEventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [showReassign, setShowReassign] = useState(false);
    const [organizers, setOrganizers] = useState([]);
    const [reassignLoading, setReassignLoading] = useState(false);
    const [selectedOrganizerId, setSelectedOrganizerId] = useState('');
  
    // Volunteer apply flow
    const [needs, setNeeds] = useState([]);
    const [myApplication, setMyApplication] = useState(null);
    const [applyingNeedId, setApplyingNeedId] = useState(null);
  
    // Attendee ticket purchase flow
    const [ticketTypes, setTicketTypes] = useState([]);
    const [myTicket, setMyTicket] = useState(null);
    const [buyingTypeId, setBuyingTypeId] = useState(null);
    const [paymentType, setPaymentType] = useState('cash');
    const [showBuyModal, setShowBuyModal] = useState(null); // holds the selected ticket type
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentReference, setPaymentReference] = useState('');
    const [selectedMethodId, setSelectedMethodId] = useState(null);
  
    // Event-level feedback (visible when completed)
    const [eventFeedback, setEventFeedback] = useState(null); // { average, count, comments: [...] }
    const [qrPreview, setQrPreview] = useState(false);
    const [qrDownloading, setQrDownloading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const { user } = useAuthStore();
    const toast = useToastStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      eventsService.getEvent(id)
        .then((r) => {
          setEvent(r.data);
          // Once we know it's completed, fetch event feedback
          if (r.data?.status === 'completed') {
            feedbackService.getEventFeedback(id).then((fb) => {
              const list = Array.isArray(fb.data) ? fb.data : fb.data?.feedback || [];
              if (list.length > 0) {
                const avg = list.reduce((acc, x) => acc + (x.rating || x.score || 0), 0) / list.length;
                setEventFeedback({ average: avg, count: list.length, list });
              } else {
                setEventFeedback({ average: 0, count: 0, list: [] });
              }
            }).catch(() => { /* ignore */ });
          }
        })
        .catch(() => { useToastStore.getState().error('Event not found.'); navigate('/events'); })
        .finally(() => setLoading(false));
    }, [id, navigate]);
  
    // Load volunteer needs + existing application (volunteer only)
    useEffect(() => {
      if (user?.role !== 'VOLUNTEER') return;
      Promise.allSettled([
        volunteersService.getNeedsByEvent(id),
        volunteersService.getMyApplications(),
      ]).then(([needsRes, appsRes]) => {
        if (needsRes.status === 'fulfilled') {
          setNeeds(needsRes.value.data || []);
        }
        if (appsRes.status === 'fulfilled') {
          const all = appsRes.value.data || [];
          const existing = all.find((a) => a.event_id === id);
          if (existing) setMyApplication(existing);
        }
      });
    }, [id, user?.role]);
  
    // Load ticket types + existing ticket + payment methods (attendee only)
    useEffect(() => {
      if (user?.role !== 'ATTENDEE') return;
      Promise.allSettled([
        ticketsService.getTicketTypes(id),
        ticketsService.getMyTickets(),
        paymentMethodsService.list(id),
      ]).then(([typesRes, ticketsRes, methodsRes]) => {
        if (typesRes.status === 'fulfilled') {
          setTicketTypes(typesRes.value.data || []);
        }
        if (ticketsRes.status === 'fulfilled') {
          const all = ticketsRes.value.data || [];
          const existing = all.find((t) => t.event_id === id);
          if (existing) setMyTicket(existing);
        }
        if (methodsRes.status === 'fulfilled') {
          setPaymentMethods(methodsRes.value.data || []);
        }
      });
    }, [id, user?.role]);
  
    const isOwner = user && event && (
      user.role === 'ADMIN' || event.organizer_id === user.id
    );
    const canManage = CAN_MANAGE.includes(user?.role) && isOwner;
    const isAdmin = user?.role === 'ADMIN';
    const isVolunteer = user?.role === 'VOLUNTEER';
    const isAttendee = user?.role === 'ATTENDEE';
    const nextStatus = event ? STATUS_FLOW[event.status] : null;
  
    const handleApply = async (needId) => {
      setApplyingNeedId(needId);
      try {
        const res = await volunteersService.applyToEvent(id, needId ? { needId } : {});
        setMyApplication(res.data || { status: 'pending', need_id: needId, event_id: id });
        toast.success('Application submitted! The organizer will review it.');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to apply.');
      } finally {
        setApplyingNeedId(null);
      }
    };
  
    const handleBuyTicket = async () => {
      if (!showBuyModal) return;
      if (paymentType === 'online' && !selectedMethodId) {
        toast.error('Please select which provider you sent the payment through.');
        return;
      }
      if (paymentType === 'online' && !paymentReference.trim()) {
        toast.error('Please enter your transaction ID after sending the payment.');
        return;
      }
      setBuyingTypeId(showBuyModal.id);
      try {
        const res = await ticketsService.purchaseTicket({
          ticketTypeId: showBuyModal.id,
          paymentType,
          paymentReference: paymentType === 'online' ? paymentReference.trim() : undefined,
        });
        setMyTicket(res.data || { event_id: id, payment_status: 'pending' });
        toast.success(
          paymentType === 'cash'
            ? 'Ticket reserved! Pay at the venue — the organizer will confirm your payment.'
            : 'Ticket reserved! The organizer will verify your transaction and confirm.'
        );
        setShowBuyModal(null);
        setPaymentReference('');
        setSelectedMethodId(null);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to purchase ticket.');
      } finally {
        setBuyingTypeId(null);
      }
    };
  
    const openReassign = async () => {
      setShowReassign(true);
      setSelectedOrganizerId('');
      if (organizers.length === 0) {
        try {
          const r = await usersService.listUsers({ role: 'ORGANIZER', isApproved: 'true', limit: 100 });
          setOrganizers(r.data || []);
        } catch {
          toast.error('Failed to load organizers list.');
        }
      }
    };
  
    const handleReassign = async () => {
      if (!selectedOrganizerId) return;
      setReassignLoading(true);
      try {
        await eventsService.reassignOrganizer(id, selectedOrganizerId);
        // Refresh event to get the new organizer info
        const r = await eventsService.getEvent(id);
        setEvent(r.data);
        toast.success('Event organizer reassigned.');
        setShowReassign(false);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reassign organizer.');
      } finally {
        setReassignLoading(false);
      }
    };
  
    const handleAdvanceStatus = async () => {
      try {
        await eventsService.updateStatus(id, nextStatus);
        toast.success(`Event status updated to "${nextStatus}".`);
        setEvent((e) => ({ ...e, status: nextStatus }));
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to update status.');
      }
    };
  
    const handleCancel = async () => {
      try {
        await eventsService.updateStatus(id, 'cancelled');
        toast.success('Event cancelled.');
        setEvent((e) => ({ ...e, status: 'cancelled' }));
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to cancel.');
      }
    };
  
    const handleDelete = async () => {
      try {
        await eventsService.deleteEvent(id);
        toast.success('Event deleted.');
        navigate('/events');
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to delete event.');
      }
    };
  

  return {
    id, event, setEvent, loading, confirmDelete, setConfirmDelete, confirmCancel, setConfirmCancel,
    confirmStatus, setConfirmStatus, showReassign, setShowReassign, organizers, setOrganizers,
    reassignLoading, setReassignLoading, selectedOrganizerId, setSelectedOrganizerId,
    needs, setNeeds, myApplication, setMyApplication, applyingNeedId, setApplyingNeedId,
    ticketTypes, setTicketTypes, myTicket, setMyTicket, buyingTypeId, setBuyingTypeId,
    paymentType, setPaymentType, showBuyModal, setShowBuyModal, paymentMethods, setPaymentMethods,
    paymentReference, setPaymentReference, selectedMethodId, setSelectedMethodId,
    eventFeedback, setEventFeedback, qrPreview, setQrPreview, qrDownloading, setQrDownloading,
    showShareModal, setShowShareModal, linkCopied, setLinkCopied,
    user, toast, navigate,
    isOwner, canManage, isAdmin, isVolunteer, isAttendee, nextStatus,
    handleApply, handleBuyTicket, openReassign, handleReassign,
    handleAdvanceStatus, handleCancel, handleDelete,
  };
}
