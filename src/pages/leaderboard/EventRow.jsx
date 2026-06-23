import Badge from '../../components/ui/Badge.jsx';
import { cfBanner } from '../../utils/cfDynamic.js';
import { applicationStatusColor, fmtDate } from './utils.js';

export default function EventRow({ ev }) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-border-subtle bg-surface p-2.5">
      <div
        className={`h-9 w-9 shrink-0 rounded-lg bg-purple-100 bg-cover bg-center${ev.banner_url ? ' cf-var-banner-img' : ''}`}
        style={cfBanner(ev.banner_url)}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold text-primary">{ev.title}</div>
        <div className="mt-0.5 flex gap-2 text-[10.5px] text-muted">
          <span>{fmtDate(ev.start_date)}</span>
          {ev.role_name && <span>· {ev.role_name}</span>}
          {ev.hours_logged > 0 && <span>· {ev.hours_logged}h</span>}
        </div>
      </div>
      <Badge label={ev.application_status} color={applicationStatusColor(ev.application_status)} />
    </div>
  );
}
