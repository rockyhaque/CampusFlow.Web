import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/Icon.jsx';
import { btnDangerSm, btnPrimarySm, btnSecondarySm, btnSuccessSm } from '../../../components/ui/componentClasses.js';

export default function EventDetailHeader({
  id, canManage, nextStatus, event,
  onShare, onConfirmCancel, onConfirmDelete, onConfirmStatus,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-end gap-3.5 border-b border-slate-900/6 bg-slate-50/60 px-[18px] py-3.5">
      <div className="flex flex-wrap justify-end gap-2">
        {canManage && (
          <>
            <button className={btnSecondarySm} onClick={() => navigate(`/events/${id}/manage`)}>
              <Icon name="dashboard" size={14} /> Manage
            </button>
            <button className={btnSecondarySm} onClick={() => navigate(`/events/${id}/edit`)}>
              <Icon name="edit" size={14} /> Edit
            </button>
            {nextStatus && (
              <button className={btnSuccessSm} onClick={onConfirmStatus}>
                <Icon name="arrowRight" size={14} /> {nextStatus === 'published' ? 'Publish' : `Advance to ${nextStatus}`}
              </button>
            )}
          </>
        )}
        <button className={btnPrimarySm} onClick={onShare}>
          <Icon name="share" size={14} /> Share
        </button>
        {canManage && event.status !== 'cancelled' && event.status !== 'completed' && (
          <button className={btnDangerSm} onClick={onConfirmCancel}>
            Cancel
          </button>
        )}
        {canManage && (
          <button className={btnDangerSm} onClick={onConfirmDelete}>
            <Icon name="trash" size={14} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
