export { fmtDate, fmtRelative, initials } from '../../utils/format.js';

export function shortName(fullName) {
  const words = (fullName || 'Unknown').split(' ');
  return words.length >= 2 ? `${words[0]} ${words[1]}` : words[0];
}

export function applicationStatusColor(status) {
  if (status === 'approved') return 'green';
  if (status === 'rejected') return 'red';
  return 'amber';
}
