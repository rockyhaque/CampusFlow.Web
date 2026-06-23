import { useEffect, useState, useCallback } from 'react';
import Badge from '../../../components/ui/Badge.jsx';
import Modal, { ConfirmModal } from '../../../components/ui/Modal.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import SearchInput from '../../../components/ui/SearchInput.jsx';
import { PageSpinner, Spinner } from '../../../components/ui/Spinner.jsx';
import useToastStore from '../../../stores/useToastStore.js';

import { ticketsService } from '../../../services/tickets.service.js';
import { fmtDate } from './constants.js';
import { filterBar } from '../../../components/layout/layoutClasses.js';
import {
  btnDangerSm, btnPrimarySm, btnSecondarySm, btnSuccessSm, card, cardHeader, cardSubtitle, cardTitle,
  inputField, inputLabel, inputSelect, inputWrap,
  tableRowClickable,
  tableWrap, tdPrimary, textMuted13,
} from '../../../components/ui/componentClasses.js';

export default function TicketsTab({ eventId }) {
  const [types, setTypes] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingSold, setLoadingSold] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [bulking, setBulking] = useState(false);
  const [rejectConfirm, setRejectConfirm] = useState(null);
  const [bulkRejectConfirm, setBulkRejectConfirm] = useState(false);
  const [reapplyDetail, setReapplyDetail] = useState(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('');
  const [ticketSort, setTicketSort] = useState('newest');
  const [typeModal, setTypeModal] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [typeForm, setTypeForm] = useState({ name: 'General', price: '', totalQuantity: '', description: '' });
  const [savingType, setSavingType] = useState(false);

  const openAddModal = () => {
    setEditingTypeId(null);
    setTypeForm({ name: 'General', price: '', totalQuantity: '', description: '' });
    setTypeModal(true);
  };

  const openEditModal = (t) => {
    setEditingTypeId(t.id);
    setTypeForm({ name: t.name, price: String(t.price), totalQuantity: String(t.quantity ?? ''), description: t.description || '' });
    setTypeModal(true);
  };

  const loadTypes = useCallback(() => {
    setLoadingTypes(true);
    ticketsService.getTicketTypes(eventId)
      .then((r) => setTypes(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingTypes(false));
  }, [eventId]);

  const loadSold = useCallback(() => {
    setLoadingSold(true);
    ticketsService.getEventTickets(eventId)
      .then((r) => setSold(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingSold(false));
  }, [eventId]);

  useEffect(() => { loadTypes(); loadSold(); }, [loadTypes, loadSold]);

  const handleSaveType = async (e) => {
    e.preventDefault();
    if (!typeForm.price) { useToastStore.getState().error('Price is required.'); return; }
    if (!typeForm.totalQuantity) { useToastStore.getState().error('Quantity is required.'); return; }
    setSavingType(true);
    const payload = {
      name: typeForm.name,
      price: parseFloat(typeForm.price),
      quantity: parseInt(typeForm.totalQuantity),
      description: typeForm.description || undefined,
    };
    try {
      if (editingTypeId) {
        await ticketsService.updateTicketType(editingTypeId, payload);
        useToastStore.getState().success('Ticket type updated.');
      } else {
        await ticketsService.createTicketType(eventId, payload);
        useToastStore.getState().success('Ticket type created.');
      }
      setTypeModal(false);
      setEditingTypeId(null);
      setTypeForm({ name: 'General', price: '', totalQuantity: '', description: '' });
      loadTypes();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to save ticket type.');
    } finally { setSavingType(false); }
  };

  const handleDeleteType = async (id) => {
    try {
      await ticketsService.deleteTicketType(id);
      useToastStore.getState().success('Ticket type deleted.');
      loadTypes();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to delete.');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await ticketsService.confirmCashPayment(id);
      useToastStore.getState().success('Ticket confirmed.');
      loadSold();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to confirm.');
    }
  };

  const handleReject = async (id) => {
    try {
      await ticketsService.rejectPayment(id);
      useToastStore.getState().success('Ticket rejected.');
      loadSold();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || 'Failed to reject.');
    }
  };

  const handleBulk = async (action) => {
    if (!selectedTickets.size) return;
    setBulking(true);
    try {
      await ticketsService.bulkAction([...selectedTickets], action);
      useToastStore.getState().success(`${selectedTickets.size} ticket(s) ${action}ed.`);
      setSelectedTickets(new Set());
      loadSold();
    } catch (e) {
      useToastStore.getState().error(e.response?.data?.message || `Bulk ${action} failed.`);
    } finally { setBulking(false); }
  };

  const toggleTicket = (id) => setSelectedTickets((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const pendingTickets = sold.filter((t) => t.payment_status === 'pending' || t.payment_status === 'reapplied');
  const allPendingSelected = pendingTickets.length > 0 && pendingTickets.every((t) => selectedTickets.has(t.id));

  const toggleAllPending = () => {
    if (allPendingSelected) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(pendingTickets.map((t) => t.id)));
    }
  };

  const filteredSold = sold
    .filter((t) => {
      if (ticketStatusFilter && t.payment_status !== ticketStatusFilter) return false;
      if (ticketSearch) {
        const q = ticketSearch.toLowerCase();
        const hay = `${t.full_name || ''} ${t.buyer_name || ''} ${t.email || ''} ${t.buyer_email || ''} ${t.short_code || ''} ${t.ticket_type_name || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (ticketSort === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      if (ticketSort === 'status') return (a.payment_status || '').localeCompare(b.payment_status || '');
      if (ticketSort === 'buyer') {
        const na = a.full_name || a.buyer_name || a.email || '';
        const nb = b.full_name || b.buyer_name || b.email || '';
        return na.localeCompare(nb);
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="flex flex-col gap-5">
      {/* Ticket Types */}
      <div className={card}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Ticket Types</div>
            <div className={cardSubtitle}>General, Student, Guest, VIP tiers</div>
          </div>
          <button className={btnPrimarySm} onClick={openAddModal}>+ Add Type</button>
        </div>
        {loadingTypes ? <PageSpinner /> : types.length === 0 ? (
          <EmptyState
            icon="ticket"
            title="No ticket types yet"
            description="Add ticket tiers for attendees to purchase."
          />
        ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr><th>Type</th><th>Price</th><th>Total</th><th>Remaining</th><th>Sold</th><th>Action</th></tr>
              </thead>
              <tbody>
                {types.map((t) => (
                  <tr key={t.id}>
                    <td className={tdPrimary}>{t.name}</td>
                    <td>{Number(t.price || 0).toFixed(2)} ৳</td>
                    <td>{t.quantity ?? '∞'}</td>
                    <td>{t.available_quantity ?? '∞'}</td>
                    <td>{t.quantity != null && t.available_quantity != null ? (t.quantity - t.available_quantity) : (t.sold_count ?? 0)}</td>
                    <td>
                      <div className="flex gap-1.5">
                        <button className={btnSecondarySm} onClick={() => openEditModal(t)}>Edit</button>
                        <button className={btnDangerSm} onClick={() => handleDeleteType(t.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sold Tickets */}
      <div className={card}>
        <div className={cardHeader}>
          <div>
            <div className={cardTitle}>Sold Tickets</div>
            <div className={cardSubtitle}>
              {filteredSold.length !== sold.length
                ? `${filteredSold.length} of ${sold.length} ticket${sold.length !== 1 ? 's' : ''}`
                : `${sold.length} ticket${sold.length !== 1 ? 's' : ''} sold`}
            </div>
          </div>
          {selectedTickets.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted">{selectedTickets.size} selected</span>
              <button className={btnSuccessSm} onClick={() => handleBulk('confirm')} disabled={bulking}>
                {bulking ? 'Working…' : 'Confirm All'}
              </button>
              <button className={btnDangerSm} onClick={() => setBulkRejectConfirm(true)} disabled={bulking}>
                Reject All
              </button>
            </div>
          )}
        </div>
        {loadingSold ? <PageSpinner /> : sold.length === 0 ? (
          <EmptyState icon="inbox" title="No tickets sold yet" />
        ) : (
          <>
            <div className={`${filterBar} mb-3`}>
              <SearchInput
                className="relative min-w-[180px] flex-1"
                variant="combined"
                placeholder="Search buyer, email, code…"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
              <select
                className={`${inputSelect} w-[150px]`}
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
                <option value="reapplied">Reapplied</option>
              </select>
              <select
                className={`${inputSelect} w-[150px]`}
                value={ticketSort}
                onChange={(e) => setTicketSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="status">By status</option>
                <option value="buyer">By buyer</option>
              </select>
            </div>
            {filteredSold.length === 0 ? (
              <EmptyState
                icon="search"
                iconSize={32}
                title="No tickets match"
                description="Try adjusting your search or filters."
              />
            ) : (
          <div className={tableWrap}>
            <table>
              <thead>
                <tr>
                  <th className="w-9">
                    <input type="checkbox" checked={allPendingSelected} onChange={toggleAllPending}
                      title="Select all pending" className="cursor-pointer" />
                  </th>
                  <th>Buyer</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Payment</th>
                  <th>TrxID</th>
                  <th>Status</th>
                  <th>Purchased</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSold.map((t) => {
                  const buyerName = t.full_name || t.buyer_name;
                  const buyerEmail = t.email || t.buyer_email;
                  const purchased = t.created_at || t.purchased_at;
                  const isPending = t.payment_status === 'pending';
                  const isActionable = isPending || t.payment_status === 'reapplied';
                  return (
                    <tr
                      key={t.id}
                      className={`${tableRowClickable} ${selectedTickets.has(t.id) ? 'bg-violet-500/[0.04]' : ''}`}
                      onClick={() => setReapplyDetail(t)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        {isActionable && (
                          <input type="checkbox" checked={selectedTickets.has(t.id)}
                            onChange={() => toggleTicket(t.id)} className="cursor-pointer" />
                        )}
                      </td>
                      <td>
                        <div className={tdPrimary}>{buyerName || buyerEmail || '—'}</div>
                        <div className="text-xs text-muted">{buyerEmail}</div>
                      </td>
                      <td>
                        {t.short_code ? (
                          <span className="whitespace-nowrap rounded px-[7px] py-[3px] font-mono text-xs tracking-wide text-accent bg-violet-500/[0.08]">
                            {t.short_code}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="text-[13px]">{t.ticket_type_name || '—'}</td>
                      <td>
                        <Badge label={t.payment_type || 'cash'} color={t.payment_type === 'online' ? 'cyan' : 'amber'} />
                      </td>
                      <td>
                        {t.payment_reference
                          ? <span className="select-all font-mono text-xs text-default">{t.payment_reference}</span>
                          : <span className="text-xs text-muted">—</span>}
                      </td>
                      <td><Badge label={t.payment_status || 'pending'} /></td>
                      <td className={textMuted13}>{fmtDate(purchased)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {isActionable ? (
                          <div className="flex gap-1.5">
                            <button className={btnSuccessSm} onClick={() => handleConfirm(t.id)}>Confirm</button>
                            <button className={btnDangerSm} onClick={() => setRejectConfirm(t.id)}>Reject</button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer select-none text-xs text-muted"
                            onClick={() => setReapplyDetail(t)}
                          >
                            View
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            )}
          </>
        )}
      </div>

      {/* Ticket detail modal (all rows) */}
      {reapplyDetail && (() => {
        const t = reapplyDetail;
        const isActionable = t.payment_status === 'pending' || t.payment_status === 'reapplied';
        const isReapplied = t.payment_status === 'reapplied';
        return (
          <Modal
            isOpen
            onClose={() => setReapplyDetail(null)}
            headerVariant="card"
            title="Ticket Details"
            subtitle={t.full_name || t.email}
            size="md"
          >
              {/* Base info grid */}
              <div className="mb-3.5 grid grid-cols-2 gap-x-5 gap-y-2.5">
                {[
                  ['Buyer', t.full_name || '—'],
                  ['Email', t.email || '—'],
                  ['Ticket type', t.ticket_type_name || '—'],
                  ['Status', <Badge key="s" label={t.payment_status || 'pending'} />],
                  ['Payment method', t.payment_type || '—'],
                  ['Transaction ID', t.payment_reference || '—'],
                  ['Ticket code', t.short_code || '—'],
                  ['Purchased', t.created_at ? new Date(t.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'],
                ].map(([label, val]) => (
                  <div key={label} className="border-b border-border-subtle py-2">
                    <div className="mb-[3px] text-[11px] uppercase tracking-[0.06em] text-muted">{label}</div>
                    <div className={label === 'Transaction ID' || label === 'Ticket code' ? 'break-all font-mono text-[13px] text-default' : 'break-all text-[13px] text-default'}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Reapplication section */}
              {isReapplied && (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                    {[
                      ['New provider', t.reapply_payment_provider || '—'],
                      ['New TrxID', t.reapply_payment_reference || '—'],
                      ['Reapplied at', t.reapply_at ? new Date(t.reapply_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'],
                    ].map(([label, val]) => (
                      <div key={label} className="border-b border-border-subtle py-2">
                        <div className="mb-[3px] text-[11px] uppercase tracking-[0.06em] text-muted">{label}</div>
                        <div className={label.includes('TrxID') ? 'break-all font-mono text-[13px] text-default' : 'break-all text-[13px] text-default'}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-blue-500/20 bg-blue-500/[0.06] px-3.5 py-2.5">
                    <div className="mb-1.5 text-[11px] uppercase tracking-[0.06em] text-blue-400">Reason from attendee</div>
                    <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-default">
                      {t.reapply_reason || '—'}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-[18px] flex justify-end gap-2">
                <button className={btnSecondarySm} onClick={() => setReapplyDetail(null)}>Close</button>
                {isActionable && (
                  <>
                    <button className={btnDangerSm} onClick={() => { setRejectConfirm(t.id); setReapplyDetail(null); }}>Reject</button>
                    <button className={btnSuccessSm} onClick={async () => { await handleConfirm(t.id); setReapplyDetail(null); }}>Confirm</button>
                  </>
                )}
              </div>
          </Modal>
        );
      })()}

      {/* Reject confirmation modals */}
      <ConfirmModal
        isOpen={!!rejectConfirm}
        onClose={() => setRejectConfirm(null)}
        onConfirm={async () => { const id = rejectConfirm; setRejectConfirm(null); await handleReject(id); }}
        title="Reject this ticket?"
        message="The attendee's payment will be marked as not confirmed and they will be notified by email. This cannot be undone."
        confirmText="Reject"
        danger
      />
      <ConfirmModal
        isOpen={bulkRejectConfirm}
        onClose={() => setBulkRejectConfirm(false)}
        onConfirm={async () => { setBulkRejectConfirm(false); await handleBulk('reject'); }}
        title={`Reject ${selectedTickets.size} ticket${selectedTickets.size !== 1 ? 's' : ''}?`}
        message="All selected attendees will be notified by email that their payment could not be confirmed."
        confirmText="Reject All"
        danger
      />

      {/* Type Modal */}
      <Modal isOpen={typeModal} onClose={() => setTypeModal(false)} title={editingTypeId ? 'Edit Ticket Type' : 'Add Ticket Type'}
        footer={
          <>
            <button className={btnSecondarySm} onClick={() => setTypeModal(false)}>Cancel</button>
            <button className={btnPrimarySm} onClick={handleSaveType} disabled={savingType}>
              {savingType ? <Spinner size="sm" /> : editingTypeId ? 'Save Changes' : 'Create'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          <div className={inputWrap}>
            <label className={inputLabel}>Ticket Type *</label>
            <select className={inputSelect} value={typeForm.name}
              onChange={(e) => setTypeForm((f) => ({ ...f, name: e.target.value }))}>
              {['General', 'Student', 'Guest', 'VIP'].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Price (৳ BDT) *</label>
            <input type="number" min="0" step="0.01" className={inputField} placeholder="0.00"
              value={typeForm.price} onChange={(e) => setTypeForm((f) => ({ ...f, price: e.target.value }))} />
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Total Quantity</label>
            <div className="flex items-center gap-3">
              <button type="button"
                onClick={() => setTypeForm((f) => ({ ...f, totalQuantity: Math.max(1, (parseInt(f.totalQuantity) || 1) - 1) }))}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-border-soft bg-surface text-lg font-normal text-primary transition-[border-color,color] duration-150 hover:border-accent hover:text-accent">
                −
              </button>
              <input type="number" min="1" className={`${inputField} flex-1 text-center text-base font-semibold`}
                placeholder="∞"
                value={typeForm.totalQuantity}
                onChange={(e) => setTypeForm((f) => ({ ...f, totalQuantity: e.target.value }))} />
              <button type="button"
                onClick={() => setTypeForm((f) => ({ ...f, totalQuantity: (parseInt(f.totalQuantity) || 0) + 1 }))}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-border-soft bg-surface text-lg font-normal text-primary transition-[border-color,color] duration-150 hover:border-accent hover:text-accent">
                +
              </button>
            </div>
          </div>
          <div className={inputWrap}>
            <label className={inputLabel}>Description</label>
            <input className={inputField} placeholder="Optional details"
              value={typeForm.description} onChange={(e) => setTypeForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
