import { useCallback, useEffect, useState } from 'react';
import { feedbackService } from '../../services/feedback.service.js';
import { eventsService } from '../../services/events.service.js';
import useToastStore from '../../stores/useToastStore.js';

export function useFeedback(isVolunteer) {
  const [myRatings, setMyRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [pastEvents, setPastEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingVolunteer, setRatingVolunteer] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isVolunteer) {
        const ratingsRes = await Promise.allSettled([
          feedbackService.getMyVolunteerRatings(),
        ]).then((arr) => arr[0]);
        if (ratingsRes.status === 'fulfilled') {
          const v = ratingsRes.value;
          const inner = v?.data ?? v;
          setMyRatings(Array.isArray(inner) ? inner : inner?.ratings || []);
          setAvgRating(inner?.avgRating || 0);
        }
      } else {
        const [volRes, evtRes] = await Promise.allSettled([
          feedbackService.listVolunteers(),
          eventsService.listEvents({ status: 'completed', limit: 50, page: 1 }),
        ]);
        if (volRes.status === 'fulfilled') {
          const v = volRes.value;
          setVolunteers(Array.isArray(v) ? v : v?.data || []);
        }
        if (evtRes.status === 'fulfilled') {
          const e = evtRes.value;
          setPastEvents(Array.isArray(e) ? e : e?.events || e?.data || []);
        }
      }
    } catch {
      useToastStore.getState().error('Failed to load feedback data.');
    } finally {
      setLoading(false);
    }
  }, [isVolunteer]);

  useEffect(() => { load(); }, [load]);

  return {
    myRatings,
    avgRating,
    pastEvents,
    volunteers,
    loading,
    ratingVolunteer,
    setRatingVolunteer,
    load,
  };
}

function subtitleForRole(role) {
  if (role === 'ORGANIZER') return 'Rate volunteers and browse event feedback';
  if (role === 'ATTENDEE') return 'Rate volunteers and events you attended';
  return 'Manage event feedback and volunteer ratings';
}

export function useFeedbackPageMeta(role, isVolunteer) {
  if (isVolunteer) {
    return {
      title: 'My Feedback & Ratings',
      subtitle: 'Your volunteer performance and campus ranking',
    };
  }
  return {
    title: 'Feedback & Ratings',
    subtitle: subtitleForRole(role),
  };
}
