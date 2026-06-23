import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/ui/Icon.jsx';
import { btnSecondary, inputField } from '../../../components/ui/componentClasses.js';

const SOCIAL_LINK =
  'flex flex-1 flex-col items-center gap-1.5 rounded-[10px] border border-border-subtle bg-surface px-2 py-3 text-[11px] font-medium no-underline transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]';

export default function ShareEventModal({ isOpen, onClose, event, linkCopied, onCopyLink }) {
  if (!event) return null;

  const url = window.location.href;
  const text = encodeURIComponent(event.title);
  const encodedUrl = encodeURIComponent(url);
  const socials = [
    { label: 'WhatsApp', className: `${SOCIAL_LINK} text-[#25d366]`, href: `https://wa.me/?text=${text}%20${encodedUrl}` },
    { label: 'Facebook', className: `${SOCIAL_LINK} text-[#1877f2]`, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X (Twitter)', className: `${SOCIAL_LINK} text-black`, href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}` },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Event" size="sm">
      <div className="flex flex-col items-center gap-5">
        {event.qr_code_url && (
          <div className="inline-block rounded-xl border border-border-subtle bg-white p-3">
            <img src={event.qr_code_url} alt="Event QR code" className="block h-40 w-40" />
          </div>
        )}
        <div className="text-center text-[13px] text-muted">
          Scan the QR code or share the link below
        </div>
        <div className="flex w-full gap-2">
          <input
            readOnly
            value={url}
            className={`${inputField} min-w-0 flex-1 font-mono text-xs`}
            onFocus={(e) => e.target.select()}
          />
          <button className={`${btnSecondary} h-11 min-w-[80px] shrink-0 whitespace-nowrap`} onClick={onCopyLink}>
            {linkCopied ? <><Icon name="checkCircle" size={14} /> Copied!</> : <><Icon name="clipboard" size={14} /> Copy</>}
          </button>
        </div>
        <div className="flex w-full justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${s.label}`}
              className={s.className}
            >
              <span className="text-muted">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
