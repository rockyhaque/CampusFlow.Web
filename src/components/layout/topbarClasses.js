/** Shared Tailwind classes for Topbar (replaces topbar.css). */

export const topbar =
  'relative z-[200] flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-900/8 bg-[#f6f7fb]/85 px-7 backdrop-blur-[10px] max-[900px]:z-[265] max-[900px]:px-3.5';

export const topbarLeft = 'flex min-w-0 flex-row items-center gap-2';

export const topbarIconBtn =
  'relative flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[10px] border border-slate-900/8 bg-slate-400/8 text-slate-700 transition-all duration-[120ms] hover:bg-slate-400/14 hover:text-slate-900';

export const topbarNavToggle = 'hidden max-[900px]:flex';

export const topbarRight = 'relative flex shrink-0 items-center gap-3';

export const topbarNotifDot =
  'absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[#f6f7fb] bg-red-500';

export const topbarUser =
  'inline-flex items-center gap-2.5 rounded-xl border border-slate-900/8 bg-white/65 px-2.5 py-1.5 transition-[background,border-color] duration-[120ms] hover:border-violet-500/18 hover:bg-white/90';

export const topbarUserMeta =
  'flex flex-col items-start text-left leading-[1.1] max-[900px]:hidden';

export const topbarUserName =
  'max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-slate-900';

export const topbarUserRole =
  'mt-0.5 text-[11px] uppercase tracking-[0.06em] text-slate-500';

export const topbarUserMenu =
  'absolute right-0 top-[calc(100%+8px)] z-[1001] w-[220px] overflow-hidden rounded-[14px] border border-slate-900/12 bg-white p-1.5 shadow-[0_12px_32px_rgba(2,6,23,0.18)]';

export const topbarMenuItem =
  'flex w-full items-center gap-2.5 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 transition-[background,border-color,color] duration-[120ms] hover:border-violet-500/16 hover:bg-violet-500/8 hover:text-slate-900';

export const topbarMenuItemDanger =
  'flex w-full items-center gap-2.5 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left text-[13px] font-medium text-red-600/90 transition-[background,border-color,color] duration-[120ms] hover:border-red-500/16 hover:bg-red-500/8 hover:text-red-700/95';

export const notifPopover =
  'absolute right-0 top-[calc(100%+8px)] z-[1000] flex max-h-[min(80vh,540px)] w-[min(96vw,400px)] flex-col overflow-hidden rounded-[14px] border border-slate-900/12 bg-white shadow-[0_12px_32px_rgba(2,6,23,0.18)]';

export const notifHeader =
  'flex items-center justify-between border-b border-slate-900/8 px-4 py-3.5';

export const notifTitle = 'text-[15px] font-semibold text-slate-900';

export const notifSubtitle = 'mt-0.5 text-xs text-slate-500';

export const notifBody = 'flex-1 overflow-y-auto';

export const notifLoading = 'p-[30px] text-center text-[13px] text-slate-500';

export const notifEmpty =
  'flex flex-col items-center gap-2 px-5 py-10 text-center text-slate-500';

export const notifEmptyTitle = 'text-sm font-medium text-slate-700';

export const notifEmptySub = 'text-xs';

export const notifItem = (unread) =>
  `flex items-start gap-3 border-b border-l-[3px] border-slate-900/8 px-4 py-3 ${
    unread
      ? 'cursor-pointer border-l-purple-600 bg-violet-500/[0.04]'
      : 'cursor-default border-l-transparent bg-transparent'
  }`;

export const notifItemContent = 'min-w-0 flex-1';

export const notifItemHeadline = (unread) =>
  `text-[13px] leading-snug text-slate-900 ${unread ? 'font-semibold' : 'font-normal'}`;

export const notifItemMessage = 'mt-[3px] text-xs leading-normal text-slate-500';

export const notifItemTime = 'mt-1.5 text-[11px] text-slate-500';

export const notifDelete = 'p-1 text-slate-500';
