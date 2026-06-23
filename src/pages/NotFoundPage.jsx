import { useNavigate } from 'react-router-dom';
import { btnPrimary } from '../components/ui/componentClasses.js';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-[64px] opacity-30">404</div>
      <h2 className="m-0 text-primary">Page not found</h2>
      <p className="m-0 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <button className={btnPrimary} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </div>
  );
}
