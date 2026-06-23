import {
  badgeBase,
  badgeColor,
} from './componentClasses.js';

const colorMap = {
  admin: 'purple',
  organizer: 'amber',
  volunteer: 'green',
  attendee: 'slate',
  published: 'green',
  ongoing: 'cyan',
  completed: 'slate',
  draft: 'amber',
  cancelled: 'red',
  active: 'green',
  inactive: 'red',
  approved: 'green',
  pending: 'amber',
  rejected: 'red',
  reapplied: 'blue',
  confirmed: 'green',
  cash: 'amber',
  online: 'cyan',
};

const formatLabel = (s) => {
  if (s == null) return s;
  const str = String(s);
  if (/^[A-Z]+-[A-Z0-9]+$/.test(str)) return str;
  if (/[a-z][A-Z]/.test(str)) return str;
  return str
    .replace(/[_\s]+/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export default function Badge({ label, color, dot }) {
  const lookupKey = typeof label === 'string' ? label.toLowerCase() : label;
  const c = color || colorMap[lookupKey] || colorMap[label] || 'slate';
  return (
    <span className={`${badgeBase} ${badgeColor(c)}`}>
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
      {formatLabel(label)}
    </span>
  );
}
