import Icon from '../../../components/ui/Icon.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import useToastStore from '../../../stores/useToastStore.js';
import { PAYMENT_METHOD_TYPES, paymentTypeBadgeClass } from '../../../services/paymentMethods.service.js';
import { btnGhostSm, btnPrimarySm, inputField, inputLabel, inputWrap } from '../../../components/ui/componentClasses.js';

export default function BuyTicketModal({
  ticketType, event, paymentType, setPaymentType, paymentMethods,
  paymentReference, setPaymentReference, selectedMethodId, setSelectedMethodId,
  buyingTypeId, onClose, onConfirm,
}) {
  const toast = useToastStore();
  if (!ticketType) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      onOverlayClick={() => !buyingTypeId && onClose()}
      closeDisabled={!!buyingTypeId}
      headerVariant="card"
      title="Buy Ticket"
      size="460"
    >
      <div className="mb-4 rounded-md border border-border-subtle bg-cyan-400/[0.06] px-4 py-3.5">
        <div className="mb-1 flex items-center justify-between">
          <div className="font-semibold text-primary">{ticketType.name}</div>
          <div className="text-lg font-bold text-accent">{Number(ticketType.price).toFixed(2)} ৳</div>
        </div>
        <div className="text-xs text-muted">{event.title}</div>
      </div>

      <div className={`${inputWrap} mb-[18px]`}>
        <label className={inputLabel}>Payment Method</label>
        <div className="flex flex-col gap-2">
          {[
            event.allow_cash !== false && { value: 'cash', label: 'Cash at venue', desc: 'Reserve now, pay the organizer at the event' },
            event.allow_online !== false && {
              value: 'online',
              label: 'Online transfer',
              desc: paymentMethods.length > 0
                ? `Send via ${paymentMethods.map((m) => (PAYMENT_METHOD_TYPES.find(t => t.value === m.method_type)?.label || m.method_type)).join(' / ')}, then enter the TrxID`
                : 'Organizer hasn\'t added online payment methods yet',
              disabled: paymentMethods.length === 0,
            },
          ].filter(Boolean).map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-2.5 rounded-md px-3.5 py-3 transition-all duration-fast ${paymentType === opt.value ? "border border-accent bg-cyan-400/[0.06]" : "border border-border-soft bg-transparent"} ${opt.disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <input
                type="radio"
                name="paymentType"
                value={opt.value}
                checked={paymentType === opt.value}
                onChange={(e) => setPaymentType(e.target.value)}
                disabled={opt.disabled}
                className="mt-0.5 accent-accent"
              />
              <div>
                <div className="text-sm font-medium text-primary">{opt.label}</div>
                <div className="mt-0.5 text-xs text-muted">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {paymentType === 'online' && paymentMethods.length > 0 && (
        <div className="mb-[18px] rounded-md border border-cyan-400/25 bg-cyan-400/[0.06] p-3.5">
          <div className="mb-2.5 text-xs uppercase tracking-[0.06em] text-muted">
            Step 1 · Select your payment provider &amp; send {Number(ticketType.price).toFixed(2)} ৳
          </div>
          <div className="flex flex-col gap-2">
            {paymentMethods.map((m) => {
              const meta = PAYMENT_METHOD_TYPES.find((t) => t.value === m.method_type);
              const isSelected = selectedMethodId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethodId(m.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-[border-color,background] duration-150 ${isSelected ? "border-[1.5px] border-accent bg-violet-500/[0.06]" : "border-[1.5px] border-border-subtle bg-surface"}`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-accent bg-accent" : "border-border-soft bg-transparent"}`}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  {meta?.icon
                    ? <img src={meta.icon} alt={meta.label} className="h-[34px] w-[34px] shrink-0 rounded-lg object-cover" />
                    : <span className={`shrink-0 rounded px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.04em] text-white ${paymentTypeBadgeClass(m.method_type)}`}>{meta?.label || m.method_type}</span>
                  }
                  <div className="min-w-0 flex-1">
                    <div className="select-all font-mono text-sm font-semibold text-primary">
                      {m.account_number}
                      {m.account_label && <span className="ml-1.5 font-sans text-xs font-normal text-muted">· {m.account_label}</span>}
                    </div>
                    {m.account_name && <div className="mt-0.5 text-[11px] text-muted">{m.account_name}</div>}
                    {m.instructions && <div className="mt-0.5 text-[11px] italic text-muted">{m.instructions}</div>}
                  </div>
                  <button
                    type="button"
                    className={`${btnGhostSm} p-1`}
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(m.account_number); toast.success('Copied'); }}
                    title="Copy"
                  >
                    <Icon name="clipboard" size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {selectedMethodId && (
            <>
              <div className="my-3.5 mb-1.5 text-xs uppercase tracking-[0.06em] text-muted">
                Step 2 · Enter your transaction ID
              </div>
              <input
                className={`${inputField} font-mono`}
                placeholder="e.g. 8AB12CD34E"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
              <div className="mt-1.5 text-[11px] leading-normal text-muted">
                Your ticket stays <strong>pending</strong> until the organizer verifies your TrxID. They'll confirm and your QR code becomes valid.
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2.5">
        <button type="button" className={btnGhostSm} onClick={onClose} disabled={!!buyingTypeId}>Cancel</button>
        <button
          type="button"
          className={btnPrimarySm}
          onClick={onConfirm}
          disabled={!!buyingTypeId || (paymentType === 'online' && (!selectedMethodId || !paymentReference.trim()))}
        >
          {buyingTypeId ? 'Processing…' : `Reserve — ${Number(ticketType.price).toFixed(2)} ৳`}
        </button>
      </div>
    </Modal>
  );
}
