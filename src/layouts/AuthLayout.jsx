import { Outlet } from 'react-router-dom';
import {
  authLeft,
  authLeftOverlay,
  authRight,
  authShell,
  authSplit,
} from '../components/layout/layoutClasses.js';

export default function AuthLayout() {
  return (
    <div className={authShell}>
      <div className={authSplit}>
        <main className={authRight}>
          <Outlet />
        </main>
        <aside className={authLeft} aria-hidden="true">
          <div className={authLeftOverlay} />
        </aside>
      </div>
    </div>
  );
}
