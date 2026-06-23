import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireGuest, RequireRole } from './router.jsx';
import RouteFallback from './components/ui/RouteFallback.jsx';
import ToastContainer from './components/ui/Toast.jsx';

// Layouts — keep eager (small, needed immediately)
import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';

// Lazy-loaded pages — each becomes its own chunk (faster first load on mobile)
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage.jsx'));
const VerifyOtpPage = lazy(() => import('./pages/auth/VerifyOtpPage.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));
const UsersPage = lazy(() => import('./pages/users/UsersPage.jsx'));
const UserDetailPage = lazy(() => import('./pages/users/UserDetailPage.jsx'));
const CreateAdminPage = lazy(() => import('./pages/users/CreateAdminPage.jsx'));
const EventsPage = lazy(() => import('./pages/events/EventsPage.jsx'));
const EventDetailPage = lazy(() => import('./pages/events/event-detail/EventDetailPage.jsx'));
const CreateEventPage = lazy(() => import('./pages/events/CreateEventPage.jsx'));
const EditEventPage = lazy(() => import('./pages/events/EditEventPage.jsx'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage.jsx'));
const MyApplicationsPage = lazy(() => import('./pages/volunteers/MyApplicationsPage.jsx'));
const MyTicketsPage = lazy(() => import('./pages/tickets/MyTicketsPage.jsx'));
const EventManagePage = lazy(() => import('./pages/events/event-manage/EventManagePage.jsx'));
const FeedbackPage = lazy(() => import('./pages/feedback/FeedbackPage.jsx'));
const LeaderboardPage = lazy(() => import('./pages/leaderboard/LeaderboardPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function Lazy({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/verify-otp" element={<AuthLayout />}>
          <Route index element={<Lazy><VerifyOtpPage /></Lazy>} />
        </Route>

        <Route element={<RequireGuest />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Lazy><LoginPage /></Lazy>} />
            <Route path="/register" element={<Lazy><RegisterPage /></Lazy>} />
            <Route path="/forgot-password" element={<Lazy><ForgotPasswordPage /></Lazy>} />
            <Route path="/reset-password" element={<Lazy><ResetPasswordPage /></Lazy>} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Lazy><DashboardPage /></Lazy>} />
            <Route path="/profile" element={<Lazy><ProfilePage /></Lazy>} />
            <Route path="/events" element={<Lazy><EventsPage /></Lazy>} />

            <Route element={<RequireRole roles={['ORGANIZER', 'ADMIN']} />}>
              <Route path="/events/create" element={<Lazy><CreateEventPage /></Lazy>} />
            </Route>

            <Route path="/events/:id" element={<Lazy><EventDetailPage /></Lazy>} />

            <Route element={<RequireRole roles={['ORGANIZER', 'ADMIN']} />}>
              <Route path="/events/:id/edit" element={<Lazy><EditEventPage /></Lazy>} />
              <Route path="/events/:id/manage" element={<Lazy><EventManagePage /></Lazy>} />
            </Route>

            <Route element={<RequireRole roles={['VOLUNTEER']} />}>
              <Route path="/my-applications" element={<Lazy><MyApplicationsPage /></Lazy>} />
            </Route>

            <Route element={<RequireRole roles={['ATTENDEE']} />}>
              <Route path="/my-tickets" element={<Lazy><MyTicketsPage /></Lazy>} />
            </Route>

            <Route path="/feedback" element={<Lazy><FeedbackPage /></Lazy>} />
            <Route path="/leaderboard" element={<Lazy><LeaderboardPage /></Lazy>} />

            <Route element={<RequireRole roles={['ADMIN']} />}>
              <Route path="/users/create-admin" element={<Lazy><CreateAdminPage /></Lazy>} />
              <Route path="/users" element={<Lazy><UsersPage /></Lazy>} />
              <Route path="/users/:id" element={<Lazy><UserDetailPage /></Lazy>} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}
