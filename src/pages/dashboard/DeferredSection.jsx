import { useEffect, useRef, useState } from 'react';

/**
 * Mount children only when the section is near the viewport.
 * Keeps heavy chart JS off the critical path for LCP.
 */
export default function DeferredSection({ children, fallback, rootMargin = '120px', minHeight }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : fallback}
    </div>
  );
}
