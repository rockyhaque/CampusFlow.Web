import Topbar from '../../components/layout/Topbar.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import useAuthStore from '../../stores/useAuthStore.js';
import { pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import RateVolunteerModal from './RateVolunteerModal.jsx';
import VolunteerFeedbackView from './VolunteerFeedbackView.jsx';
import VolunteersSection from './VolunteersSection.jsx';
import { useFeedback, useFeedbackPageMeta } from './useFeedback.js';

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const isVolunteer = role === 'VOLUNTEER';

  const {
    myRatings,
    avgRating,
    pastEvents,
    volunteers,
    loading,
    ratingVolunteer,
    setRatingVolunteer,
    load,
  } = useFeedback(isVolunteer);

  const { title, subtitle } = useFeedbackPageMeta(role, isVolunteer);

  if (isVolunteer) {
    return (
      <>
        <Topbar />
        <div className={pageContent}>
          <div className={pageHeader}>
            <div>
              <div className={pageTitle}>{title}</div>
              <div className={pageSubtitle}>{subtitle}</div>
            </div>
          </div>
          {loading ? <PageSpinner /> : (
            <VolunteerFeedbackView myRatings={myRatings} avgRating={avgRating} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={pageHeader}>
          <div>
            <div className={pageTitle}>{title}</div>
            <div className={pageSubtitle}>{subtitle}</div>
          </div>
        </div>

        {loading ? <PageSpinner /> : (
          <VolunteersSection
            allVolunteers={volunteers}
            pastEvents={pastEvents}
            onRate={setRatingVolunteer}
            onReload={load}
          />
        )}
      </div>

      {ratingVolunteer && (
        <RateVolunteerModal
          volunteer={ratingVolunteer}
          onClose={() => setRatingVolunteer(null)}
          onSuccess={load}
        />
      )}
    </>
  );
}
