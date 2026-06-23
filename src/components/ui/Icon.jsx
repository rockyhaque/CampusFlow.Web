// Centralized icon set — react-icons (Lucide).
// Usage: <Icon name="dashboard" size={18} />

import {
  LuArrowDownWideNarrow,
  LuArrowLeft,
  LuArrowRight,
  LuAtSign,
  LuAward,
  LuBan,
  LuBell,
  LuCalendar,
  LuCamera,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuClipboard,
  LuClock,
  LuDownload,
  LuEye,
  LuEyeOff,
  LuGraduationCap,
  LuInbox,
  LuInfo,
  LuKey,
  LuLayoutDashboard,
  LuLock,
  LuLogOut,
  LuMail,
  LuMailOpen,
  LuMapPin,
  LuMenu,
  LuPenLine,
  LuPlus,
  LuPower,
  LuQrCode,
  LuRefreshCw,
  LuSearch,
  LuSend,
  LuShare2,
  LuShield,
  LuSparkles,
  LuStar,
  LuTicket,
  LuTrash2,
  LuTriangleAlert,
  LuTrophy,
  LuUser,
  LuUsers,
  LuX,
} from 'react-icons/lu';

const ICONS = {
  // Navigation
  dashboard: LuLayoutDashboard,
  menu: LuMenu,
  events: LuCalendar,
  users: LuUsers,
  user: LuUser,
  bell: LuBell,
  plus: LuPlus,
  ticket: LuTicket,
  clipboard: LuClipboard,
  award: LuAward,
  star: LuStar,
  starFilled: LuStar,
  logout: LuLogOut,
  search: LuSearch,

  // Status
  check: LuCheck,
  checkCircle: LuCircleCheck,
  x: LuX,
  xCircle: LuCircleX,
  warning: LuTriangleAlert,
  info: LuInfo,

  // Email / auth
  mail: LuMail,
  mailOpen: LuMailOpen,
  atSign: LuAtSign,
  shield: LuShield,
  lock: LuLock,
  key: LuKey,
  eye: LuEye,
  eyeOff: LuEyeOff,

  // Time / event
  clock: LuClock,
  calendar: LuCalendar,
  mapPin: LuMapPin,

  // Brand
  cap: LuGraduationCap,

  // Misc
  trash: LuTrash2,
  edit: LuPenLine,
  download: LuDownload,
  qr: LuQrCode,
  trophy: LuTrophy,
  inbox: LuInbox,
  send: LuSend,
  share: LuShare2,
  refresh: LuRefreshCw,
  arrowLeft: LuArrowLeft,
  arrowRight: LuArrowRight,
  chevronDown: LuChevronDown,
  chevronLeft: LuChevronLeft,
  chevronRight: LuChevronRight,
  spark: LuSparkles,
  power: LuPower,
  ban: LuBan,
  sortAsc: LuArrowDownWideNarrow,
  camera: LuCamera,
};

export default function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  className = '',
  style = {},
  color,
}) {
  const Component = ICONS[name];
  if (!Component) return null;

  const isFilledStar = name === 'starFilled';

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={`inline-block shrink-0 ${className}`}
      style={color ? { ...style, color } : style}
      aria-hidden="true"
      {...(isFilledStar ? { fill: color || 'currentColor' } : {})}
    />
  );
}
