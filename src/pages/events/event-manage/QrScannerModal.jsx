import { useEffect, useState, useRef } from 'react';
import Icon from '../../../components/ui/Icon.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { btnSecondarySm } from '../../../components/ui/componentClasses.js';

export default function QrScannerModal({ onClose, onScan }) {
  const containerId = 'qr-reader-container';
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let stopped = false;

    const start = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (stopped) return;
        const scanner = new Html5Qrcode(containerId, false);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            try { await scanner.pause(true); } catch { /* ignore */ }
            await onScanRef.current(decodedText);
            setTimeout(() => { try { scanner.resume(); } catch { /* ignore */ } }, 1500);
          },
          () => { /* per-frame errors are noisy — ignore */ }
        );
        if (!stopped) setIsStarting(false);
      } catch (err) {
        setError(err?.message || 'Could not access the camera. Allow camera permission and try again.');
        setIsStarting(false);
      }
    };
    start();

    return () => {
      stopped = true;
      const s = scannerRef.current;
      if (s && s.getState() !== 1 /* NOT_STARTED */) {
        s.stop().then(() => s.clear()).catch(() => { /* ignore */ });
      }
    };
  }, []);

  return (
    <Modal
      isOpen
      onClose={onClose}
      headerVariant="card"
      title="Scan Ticket QR"
      size="480"
    >
      {error ? (
        <div className="p-5 text-center text-red-400">
          <Icon name="xCircle" size={32} />
          <div className="mt-2.5 text-sm">{error}</div>
        </div>
      ) : (
        <>
          <div id={containerId} className="relative mb-3 min-h-[280px] w-full overflow-hidden rounded-md bg-black" />
          {isStarting && (
            <div className="mb-2 text-center text-[13px] text-muted">
              Starting camera…
            </div>
          )}
          <div className="text-center text-xs leading-normal text-muted">
            Point the camera at the attendee's QR code. Each scan checks them in automatically.
          </div>
        </>
      )}

      <div className="mt-3.5 flex justify-end">
        <button type="button" className={btnSecondarySm} onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
