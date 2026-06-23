import useToastStore from '../../stores/useToastStore.js';
import Icon from './Icon.jsx';
import {
  toastBase,
  toastBody,
  toastContainer,
  toastDismiss,
  toastIcon,
  toastMessage,
  toastType,
} from './componentClasses.js';

const TOAST_ICONS = {
  success: 'check',
  error: 'xCircle',
  warning: 'warning',
  info: 'info',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className={toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} className={`${toastBase} ${toastType(t.type)}`}>
          <span className={toastIcon}>
            <Icon name={TOAST_ICONS[t.type]} size={16} strokeWidth={2} />
          </span>
          <div className={toastBody}>
            <p className={toastMessage}>{t.message}</p>
          </div>
          <button type="button" className={toastDismiss} onClick={() => dismiss(t.id)}>
            <Icon name="x" size={14} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
