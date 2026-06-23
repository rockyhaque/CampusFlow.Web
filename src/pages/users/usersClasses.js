/** Shared classes and helpers for users admin pages. */

export {
  dashStagger,
  dashboardError,
  dashboardErrorRetry,
  dashboardLoaded,
  rowNavProps,
} from '../dashboard/dashboardClasses.js';

export const usersTableCard =
  'overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm';

export const usersFilterBar =
  'mb-5 flex flex-wrap items-center gap-2.5 [&_.search-input]:w-full [&_.search-wrap]:min-w-[200px] [&_.search-wrap]:flex-[1_1_220px]';

export const usersRowEnter = 'dashboard-enter';

export const dropdownEnter = 'dropdown-panel-enter';

/** Format role for display (Organizer vs ORGANIZER). */
export function formatRole(role) {
  if (!role) return '—';
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export const createAdminCard =
  'overflow-hidden rounded-xl border border-border-subtle bg-surface p-6 shadow-sm';

export const createAdminNote =
  'mb-5 flex items-start gap-2 rounded-lg border border-purple-500/20 bg-purple-500/[0.06] px-3.5 py-3 text-sm text-default';

export const createAdminFormActions =
  'flex flex-wrap gap-2.5 pt-2 max-[600px]:flex-col [&_button]:max-[600px]:min-h-11 [&_button]:max-[600px]:w-full';

export const createAdminFieldEnter = 'dashboard-enter';
