import Icon from './Icon.jsx';
import {
  emptyState,
  emptyStateDesc,
  emptyStateIcon,
  emptyStateTitle,
} from './componentClasses.js';

export default function EmptyState({
  icon,
  title,
  description,
  iconSize = 40,
  iconStrokeWidth = 1.4,
  className = '',
}) {
  return (
    <div className={[emptyState, className].filter(Boolean).join(' ')}>
      <div className={`${emptyStateIcon} text-muted`}>
        <Icon name={icon} size={iconSize} strokeWidth={iconStrokeWidth} />
      </div>
      <div className={emptyStateTitle}>{title}</div>
      {description != null && description !== '' && (
        <div className={emptyStateDesc}>{description}</div>
      )}
    </div>
  );
}
