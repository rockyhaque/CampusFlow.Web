import { useEffect } from 'react';
import Icon from './Icon.jsx';
import {
  btnDangerSm,
  btnGhostSm,
  btnPrimarySm,
  btnSecondarySm,
  cardHeader,
  cardSubtitle,
  cardTitle,
  modal,
  modalClose,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalSizes,
  modalTitle,
} from './componentClasses.js';

const SIZE_CLASS = {
  sm: modalSizes.sm,
  md: modalSizes.md,
  lg: modalSizes.lg,
  460: 'max-w-[460px]',
  480: 'max-w-[480px]',
  620: 'max-w-[620px]',
};

export default function Modal({
  isOpen = true,
  onClose,
  title,
  subtitle,
  header,
  headerVariant = 'default',
  children,
  size = 'md',
  footer,
  closeDisabled = false,
  onOverlayClick,
  panelClassName = '',
  bodyClassName = '',
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    if (onOverlayClick) {
      onOverlayClick();
      return;
    }
    onClose?.();
  };

  const sizeClass = SIZE_CLASS[size] || modalSizes.md;

  const renderHeader = () => {
    if (header) return header;
    if (!title && headerVariant !== 'card') return null;

    if (headerVariant === 'card') {
      return (
        <div className={cardHeader}>
          <div>
            {title && <div className={cardTitle}>{title}</div>}
            {subtitle && <div className={cardSubtitle}>{subtitle}</div>}
          </div>
          <button type="button" className={btnGhostSm} onClick={onClose} disabled={closeDisabled}>
            <Icon name="x" size={14} />
          </button>
        </div>
      );
    }

    return (
      <div className={modalHeader}>
        <h2 className={modalTitle}>{title}</h2>
        <button type="button" className={modalClose} onClick={onClose} disabled={closeDisabled}>
          <Icon name="x" size={16} strokeWidth={2} />
        </button>
      </div>
    );
  };

  return (
    <div className={modalOverlay} onClick={handleOverlayClick}>
      <div
        className={`${modal} ${sizeClass} ${panelClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {renderHeader()}
        <div className={bodyClassName || undefined}>{children}</div>
        {footer && <div className={modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className={btnSecondarySm} onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={danger ? btnDangerSm : btnPrimarySm}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm leading-normal text-default">{message}</p>
    </Modal>
  );
}
