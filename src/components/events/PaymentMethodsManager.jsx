import { useEffect, useState, useCallback } from 'react';
import { paymentMethodsService, PAYMENT_METHOD_TYPES, paymentTypeBadgeClass } from '../../services/paymentMethods.service.js';
import useToastStore from '../../stores/useToastStore.js';
import Icon from '../ui/Icon.jsx';
import { Spinner } from '../ui/Spinner.jsx';
import SelectMenu from '../ui/SelectMenu.jsx';
import { formGrid, formGridSpan2 } from '../layout/layoutClasses.js';
import { btnGhostSm, btnPrimarySm, btnSecondarySm, inputField, inputLabel, inputWrap, textareaField } from '../ui/componentClasses.js';

const blank = { methodType: 'bkash', accountName: '', accountNumber: '', accountLabel: '', instructions: '' };

/**
 * Manage payment methods for an event.
 * - When `eventId` is provided, fetches/creates/updates/deletes against the API.
 * - When omitted (event not yet created), keeps everything in local state and
 *   exposes the list via `onLocalChange` so the parent can persist after the
 *   event is created.
 */
export default function PaymentMethodsManager({ eventId, onLocalChange }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); 
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const fetchMethods = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const r = await paymentMethodsService.list(eventId);
      setMethods(r.data || []);
    } catch {
      useToastStore.getState().error('Failed to load payment methods.');
    } finally { setLoading(false); }
  }, [eventId]);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const startCreate = () => { setForm(blank); setEditing('new'); };
  const startEdit = (m) => {
    setForm({
      methodType: m.method_type,
      accountName: m.account_name || '',
      accountNumber: m.account_number,
      accountLabel: m.account_label || '',
      instructions: m.instructions || '',
    });
    setEditing(m);
  };
  const cancel = () => { setEditing(null); setForm(blank); };

  const save = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!form.methodType || !form.accountNumber) {
      useToastStore.getState().error('Method type and account number are required.');
      return;
    }
    setSaving(true);
    try {
      if (eventId) {
        if (editing === 'new') {
          await paymentMethodsService.create(eventId, form);
          useToastStore.getState().success('Payment method added.');
        } else {
          await paymentMethodsService.update(editing.id, form);
          useToastStore.getState().success('Payment method updated.');
        }
        await fetchMethods();
      } else {
        // Local-only mode (event not yet created)
        const next = editing === 'new'
          ? [...methods, { ...form, _localId: Date.now() }]
          : methods.map((m) => m._localId === editing._localId ? { ...form, _localId: editing._localId } : m);
        setMethods(next);
        onLocalChange?.(next);
      }
      cancel();
    } catch (err) {
      useToastStore.getState().error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Remove this ${m.method_type || m.methodType} payment method?`)) return;
    try {
      if (eventId && m.id) {
        await paymentMethodsService.remove(m.id);
        useToastStore.getState().success('Payment method removed.');
        await fetchMethods();
      } else {
        const next = methods.filter((x) => x._localId !== m._localId);
        setMethods(next);
        onLocalChange?.(next);
      }
    } catch {
      useToastStore.getState().error('Remove failed.');
    }
  };

  const typeLabel = (t) => PAYMENT_METHOD_TYPES.find((x) => x.value === t)?.label || t;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Payment Methods</div>
        </div>
        {!editing && (
          <button type="button" className={btnSecondarySm} onClick={startCreate}>
            <Icon name="plus" size={13} /> Add
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-3.5 text-center"><Spinner /></div>
      ) : methods.length === 0 && !editing ? (
        <div className="rounded-[10px] border border-dashed border-violet-500/22 bg-violet-500/5 px-4 py-5 text-center text-[13px] text-slate-500">
          No payment methods yet. Without one, attendees can only pay in cash at the venue.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {methods.map((m) => {
            const type = m.method_type || m.methodType;
            const num = m.account_number || m.accountNumber;
            const name = m.account_name || m.accountName;
            const label = m.account_label || m.accountLabel;
            const instr = m.instructions;
            return (
              <div
                key={m.id || m._localId}
                className="flex items-center gap-3.5 rounded-[10px] border border-slate-900/8 bg-white/70 px-3.5 py-3"
              >
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-[3px] pl-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(2,6,23,0.08)] ${paymentTypeBadgeClass(type)}`}
                >
                  {(() => { const t = PAYMENT_METHOD_TYPES.find((x) => x.value === type); return t?.icon ? <img src={t.icon} alt="" className="h-5 w-5 shrink-0 rounded object-cover" /> : null; })()}
                  {typeLabel(type)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {num} {label && <span className="text-xs font-normal text-slate-500">· {label}</span>}
                  </div>
                  {(name || instr) && (
                    <div className="mt-0.5 text-xs text-slate-500">
                      {name}{name && instr ? ' · ' : ''}{instr}
                    </div>
                  )}
                </div>
                <button type="button" className={btnGhostSm} onClick={() => startEdit(m)} title="Edit">
                  <Icon name="edit" size={13} />
                </button>
                <button type="button" className={`${btnGhostSm} text-red-400`} onClick={() => remove(m)} title="Remove">
                  <Icon name="trash" size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        // NOTE: This is a <div> (not a <form>) because this component is often rendered
        // inside a parent <form> (e.g. CreateEventPage). Nested forms are invalid HTML
        // and would cause the parent form to submit when "Add Method" is clicked.
        <div className="mt-3 rounded-[10px] border border-violet-500/18 bg-violet-500/5 p-4">
          <div className={formGrid}>
            <div className={inputWrap}>
              <label className={inputLabel}>Method type *</label>
              <SelectMenu
                value={form.methodType}
                onChange={(v) => setForm((f) => ({ ...f, methodType: v }))}
                placeholder="Select method"
                width="100%"
                options={PAYMENT_METHOD_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                allowClear={false}
              />
            </div>
            <div className={inputWrap}>
              <label className={inputLabel}>Account number *</label>
              <input
                type="text"
                className={inputField}
                placeholder="01712345678"
                value={form.accountNumber}
                onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                onKeyDown={(e) => {
                  // Enter inside this field would submit the OUTER form — block it
                  if (e.key === 'Enter') { e.preventDefault(); save(e); }
                }}
              />
            </div>
            <div className={inputWrap}>
              <label className={inputLabel}>Account name</label>
              <input
                type="text"
                className={inputField}
                placeholder="Test event committee"
                value={form.accountName}
                onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(e); } }}
              />
            </div>
            <div className={inputWrap}>
              <label className={inputLabel}>Account type / label</label>
              <input
                type="text"
                className={inputField}
                placeholder="Personal, Merchant, Savings…"
                value={form.accountLabel}
                onChange={(e) => setForm((f) => ({ ...f, accountLabel: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(e); } }}
              />
            </div>
            <div className={`input-wrap ${formGridSpan2}`}>
              <label className={inputLabel}>Instructions (optional)</label>
              <textarea
                className={`${textareaField} bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.14)]`}
                rows={2}
                placeholder="Send via Send Money — no fee"
                value={form.instructions}
                onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2.5">
            <button type="button" className={btnGhostSm} onClick={cancel}>Cancel</button>
            <button type="button" className={btnPrimarySm} onClick={save} disabled={saving}>
              {saving ? <Spinner size="sm" /> : (editing === 'new' ? 'Add Method' : 'Save Changes')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
