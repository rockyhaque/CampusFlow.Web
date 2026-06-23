import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import Icon from '../../components/ui/Icon.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import { usersService } from '../../services/users.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { pageActions, pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import {
  btnPrimarySm,
  btnSuccessSm,
  dropdownDivider,
  dropdownItemTone,
  dropdownPanel,
  dropdownWrap,
  inputSelectW148,
  inputSelectW160,
  kebabBtn,
  tableActionsCol,
  tableMeta,
  tableMutedSm,
  tableRowActions,
  tableRowClickable,
  tableUserCell,
  tableUserEmail,
  tableUserName,
  tableWrap,
} from '../../components/ui/componentClasses.js';
import {
  dashStagger,
  dashboardError,
  dashboardErrorRetry,
  dashboardLoaded,
  dropdownEnter,
  formatRole,
  rowNavProps,
  usersFilterBar,
  usersRowEnter,
  usersTableCard,
} from './usersClasses.js';

const ROLES = ['ADMIN', 'ORGANIZER', 'VOLUNTEER', 'ATTENDEE'];
const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest first' },
  { value: 'created_at:asc', label: 'Oldest first' },
  { value: 'full_name:asc', label: 'Name A–Z' },
  { value: 'full_name:desc', label: 'Name Z–A' },
  { value: 'role:asc', label: 'Role A–Z' },
];

function KebabMenu({ user, onView, onToggleActive, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = `user-menu-${user.id}`;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const keyHandler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  const action = (fn) => () => { setOpen(false); fn(); };

  return (
    <div ref={ref} className={dropdownWrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={kebabBtn(open)}
        aria-label={`Actions for ${user.full_name || user.email}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <span aria-hidden>⋮</span>
      </button>

      {open && (
        <div id={menuId} role="menu" className={`${dropdownPanel} ${dropdownEnter}`}>
          <MenuItem icon="eye" label="View profile" onClick={action(onView)} />
          <div className={dropdownDivider} role="separator" />
          <MenuItem
            icon="power"
            label={user.is_active ? 'Deactivate' : 'Activate'}
            tone={user.is_active ? 'amber' : 'green'}
            onClick={action(onToggleActive)}
          />
          <MenuItem icon="trash" label="Delete" tone="red" onClick={action(onDelete)} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, tone, onClick }) {
  const iconColor = tone === 'amber' ? 'var(--amber-400)' : tone === 'green' ? 'var(--green-400)' : tone === 'red' ? 'var(--red-400)' : 'var(--text-muted)';
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={dropdownItemTone(tone)}
    >
      <Icon name={icon} size={14} strokeWidth={2} color={iconColor} aria-hidden />
      {label}
    </button>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('created_at:desc');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const [sortBy, sortOrder] = sort.split(':');
    const params = { page, limit: 15, sortBy, sortOrder };
    if (search) params.search = search;
    if (role) params.role = role;
    if (statusFilter) params.isActive = statusFilter;

    usersService.listUsers(params)
      .then((main) => {
        setUsers(main.data || []);
        if (main.pagination) {
          setPagination({ ...main.pagination, totalPages: main.pagination.pages || 1 });
        }
      })
      .catch((e) => {
        const message = e.response?.data?.message || 'Failed to load users';
        setError(message);
        useToastStore.getState().error(message);
      })
      .finally(() => setLoading(false));
  }, [page, search, role, statusFilter, sort]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id, name) => {
    setApprovingId(id);
    try {
      await usersService.approveOrganizer(id);
      useToastStore.getState().success(`${name} approved as organizer.`);
      load();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Approval failed.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await usersService.toggleActive(id, !current);
      useToastStore.getState().success(`User ${!current ? 'activated' : 'deactivated'}.`);
      load();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      useToastStore.getState().success('User deleted.');
      setConfirmDelete(null);
      load();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Delete failed.');
    }
  };

  const showContent = !loading && !error;

  return (
    <>
      <Topbar />
      <div className={`${pageContent} ${showContent ? dashboardLoaded : ''}`}>
        <header className={pageHeader}>
          <div>
            <h1 className={pageTitle}>Users</h1>
            <p className={pageSubtitle}>
              Manage platform members{pagination.total != null ? ` · ${pagination.total} total` : ''}
            </p>
          </div>
          <div className={pageActions}>
            <button
              type="button"
              className={`${btnPrimarySm} dashboard-enter`}
              style={dashStagger(0).style}
              onClick={() => navigate('/users/create-admin')}
            >
              + Create Admin
            </button>
          </div>
        </header>

        <div className={`${usersFilterBar} dashboard-enter`} style={dashStagger(1).style}>
          <SearchInput
            className="min-w-[180px] flex-[1_1_220px]"
            variant="compact"
            iconSize={15}
            placeholder="Search by name or email…"
            ariaLabel="Search users by name or email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <label className="sr-only" htmlFor="users-role-filter">Filter by role</label>
          <select
            id="users-role-filter"
            className={inputSelectW148}
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{formatRole(r)}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="users-status-filter">Filter by status</label>
          <select
            id="users-status-filter"
            className={inputSelectW148}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <label className="sr-only" htmlFor="users-sort">Sort users</label>
          <select
            id="users-sort"
            className={inputSelectW160}
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading && <PageSpinner />}

        {error && !loading && (
          <div className={dashboardError} role="alert">
            <Icon name="warning" size={16} />
            <span>{error}</span>
            <button type="button" className={dashboardErrorRetry} onClick={load}>Retry</button>
          </div>
        )}

        {showContent && (
          <div className={`${usersTableCard} dashboard-section-enter`} style={dashStagger(2).style} aria-busy={loading}>
            <p className="sr-only" aria-live="polite">
              Showing {users.length} user{users.length === 1 ? '' : 's'} on page {pagination.page || page} of {pagination.totalPages || 1}
            </p>
            {users.length === 0 ? (
              <EmptyState
                icon="users"
                title="No users found"
                description="Try adjusting your search or filters."
              />
            ) : (
              <div className={tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">User</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col">Approved</th>
                      <th scope="col">Joined</th>
                      <th scope="col" className={tableActionsCol}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => {
                      const name = u.full_name || u.email?.split('@')[0] || 'Unknown';
                      return (
                        <tr
                          key={u.id}
                          className={usersRowEnter}
                          style={dashStagger(i).style}
                        >
                          <td
                            className={tableRowClickable}
                            aria-label={`View profile for ${name}`}
                            {...rowNavProps(navigate, `/users/${u.id}`)}
                          >
                            <div className={tableUserCell}>
                              <Avatar name={name} src={u.photo_url} size="sm" />
                              <div>
                                <div className={tableUserName}>{name}</div>
                                <div className={tableUserEmail}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><Badge label={u.role} /></td>
                          <td><Badge label={u.is_active ? 'active' : 'inactive'} /></td>
                          <td>
                            {u.role === 'ORGANIZER'
                              ? <Badge label={u.is_approved ? 'approved' : 'pending'} />
                              : <span className={tableMutedSm}>Auto</span>}
                          </td>
                          <td className={tableMeta}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td>
                            <div className={tableRowActions}>
                              {u.role === 'ORGANIZER' && !u.is_approved && (
                                <button
                                  type="button"
                                  className={btnSuccessSm}
                                  disabled={approvingId === u.id}
                                  onClick={() => handleApprove(u.id, name)}
                                >
                                  {approvingId === u.id ? 'Approving…' : 'Approve'}
                                </button>
                              )}
                              <KebabMenu
                                user={u}
                                onView={() => navigate(`/users/${u.id}`)}
                                onToggleActive={() => handleToggleActive(u.id, u.is_active)}
                                onDelete={() => setConfirmDelete(u)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {showContent && users.length > 0 && (
          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        )}

        <ConfirmModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete.id)}
          title="Delete User"
          message={`Are you sure you want to permanently delete ${confirmDelete?.full_name || confirmDelete?.email}? This cannot be undone.`}
          confirmText="Delete"
          danger
        />
      </div>
    </>
  );
}
