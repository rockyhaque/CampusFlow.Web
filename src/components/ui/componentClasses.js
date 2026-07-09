/** Shared Tailwind classes (replaces components.css). Legacy hook names kept where descendant selectors depend on them. */

const btnBase =
  'btn inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border-0 px-5 text-sm font-medium tracking-[0.01em] no-underline transition-all duration-[180ms] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

export const btnSm = `${btnBase} h-8 px-3 text-[13px]`;
export const btnSmFull = `${btnSm} w-full`;
export const btnLg = `${btnBase} h-12 px-7 text-[15px]`;
export const btnFull = `${btnBase} w-full`;

export const btnPrimary = `${btnBase} min-h-10 bg-accent-gradient text-white shadow-glow hover:opacity-[0.88] hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35 max-[900px]:min-h-11`;
export const btnPrimarySm = `${btnPrimary} h-8 min-h-8 px-3 text-[13px] max-[900px]:min-h-11 max-[900px]:px-4`;
export const btnPrimaryLg = `${btnPrimary} h-12 px-7 text-[15px]`;
export const btnPrimaryFull = `${btnPrimary} w-full`;
export const btnPrimaryFullLg = `${btnPrimaryLg} w-full`;
export const btnPrimaryFullSm = `${btnPrimarySm} w-full`;

export const btnSecondary = `${btnBase} min-h-10 border border-border-soft bg-slate-400/10 text-default hover:border-border-soft hover:bg-slate-400/18 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35 max-[900px]:min-h-11`;
export const btnSecondarySm = `${btnSecondary} h-8 min-h-8 px-3 text-[13px] max-[900px]:min-h-11 max-[900px]:px-4`;
export const btnSecondaryFullSm = `${btnSecondarySm} w-full`;

export const btnGhost = `${btnBase} bg-transparent text-default hover:bg-slate-400/8 hover:text-primary`;
export const btnGhostSm = `${btnGhost} h-8 px-3 text-[13px]`;

export const btnDanger = `${btnBase} border border-red-500/20 bg-red-500/12 text-red-400 hover:bg-red-500/20`;
export const btnDangerSm = `${btnDanger} h-8 px-3 text-[13px]`;

export const btnSuccess = `${btnBase} border border-green-500/20 bg-green-500/12 text-green-400 hover:bg-green-500/20`;
export const btnSuccessSm = `${btnSuccess} h-8 min-h-8 px-3 text-[13px] max-[900px]:min-h-11 max-[900px]:px-4`;

/* ── Inputs ──────────────────────────────────────────────────────────────── */

export const inputWrap = 'input-wrap flex flex-col gap-1.5';

export const inputLabel =
  'input-label text-sm font-bold text-default';

export const inputField =
  'input-field box-border h-11 w-full rounded-md border border-border-soft bg-white px-3.5 text-sm text-primary outline-none transition-[border-color,box-shadow] duration-[120ms] placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.14)]';

export const inputFieldError =
  `${inputField} has-error border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]`;

export const inputSelect =
  `${inputField} select-field cursor-pointer appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9 [background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M8 10.293L3.354 5.646l-.708.708L8 11.707l5.354-5.353-.708-.708z'/%3E%3C/svg%3E")]`;

export const inputError = 'input-error text-xs text-red-400';

export const inputHint = 'input-hint text-xs text-muted';

export const inputIconWrap = 'input-icon-wrap relative';

export const inputIconWrapRight = `${inputIconWrap} has-right-icon`;

export const inputIcon =
  'input-icon pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted';

export const inputIconRight =
  'input-icon-right absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-muted hover:text-default';

export const inputFieldWithIcon = `${inputField} pl-10`;

export const inputFieldWithRightIcon = `${inputField} pr-10`;

export const inputFieldWithBothIcons = `${inputField} pl-10 pr-10`;

export const textareaField =
  'textarea-field box-border min-h-[100px] w-full resize-y rounded-md border border-border-soft bg-slate-50/80 px-3.5 py-3 font-sans text-sm text-primary outline-none transition-[border-color,box-shadow] duration-[120ms] placeholder:text-muted focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]';

/* ── Card ────────────────────────────────────────────────────────────────── */

export const card =
  'card rounded-lg border border-border-subtle bg-surface p-6';

export const cardSm = `${card} card-sm p-4`;

export const cardHeader =
  'card-header mb-5 flex items-center justify-between';

export const cardTitle =
  'card-title text-base font-semibold text-primary';

export const cardSubtitle =
  'card-subtitle mt-0.5 text-[13px] text-muted';

/* ── Stat card ───────────────────────────────────────────────────────────── */

export const statCard =
  'stat-card flex min-h-[108px] flex-col gap-2.5 rounded-[18px] border border-slate-900/8 bg-white/90 p-4 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-purple-500/20 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35';

export const statCardTop =
  'stat-card-top flex items-center justify-between gap-3.5';

export const statCardIcon = (color) =>
  `stat-card-icon flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-slate-900/6 text-xl ${
    {
      cyan: 'bg-gradient-to-b from-violet-500/16 to-violet-500/6 text-purple-700',
      green: 'bg-gradient-to-b from-green-500/16 to-green-500/6 text-green-600',
      amber: 'bg-gradient-to-b from-amber-400/18 to-amber-400/6 text-amber-600',
      red: 'bg-gradient-to-b from-red-500/16 to-red-500/6 text-red-600',
      slate: 'bg-gradient-to-b from-slate-400/16 to-slate-400/6 text-slate-600',
      purple: 'bg-gradient-to-b from-purple-500/16 to-purple-500/6 text-purple-600',
    }[color] || 'bg-gradient-to-b from-violet-500/16 to-violet-500/6 text-purple-700'
  }`;

export const statCardBody = 'stat-card-body flex flex-col';

export const statCardValue =
  'stat-card-value m-0 text-right text-[25px] font-semibold leading-[1.15] text-primary';

export const statCardLabel =
  'stat-card-label mt-auto pt-2 text-base font-medium text-slate-600/95';

export const statCardSub = 'stat-card-sub -mt-0.5 text-xs text-muted';

/* ── Badge ───────────────────────────────────────────────────────────────── */

export const badgeBase =
  'badge inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium tracking-wide';

export const badgeColor = (c) =>
  ({
    cyan: 'badge-cyan border border-cyan-400/25 bg-cyan-400/18 text-cyan-400',
    green: 'badge-green border border-green-500/25 bg-green-500/18 text-green-400',
    amber: 'badge-amber border border-amber-400/25 bg-amber-400/18 text-amber-400',
    red: 'badge-red border border-red-500/25 bg-red-500/18 text-red-400',
    slate: 'badge-slate border border-slate-400/25 bg-slate-400/18 text-slate-400',
    purple: 'badge-purple border border-purple-400/25 bg-purple-400/18 text-[#a78bfa]',
    blue: 'badge-blue border border-blue-500/25 bg-blue-500/15 text-blue-400',
  }[c] || 'badge-slate border border-slate-400/25 bg-slate-400/18 text-slate-400');

/* ── Avatar ──────────────────────────────────────────────────────────────── */

export const avatarBase =
  'avatar flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-gradient font-semibold text-white';

export const avatarSize = (size) =>
  ({
    sm: 'avatar-sm h-7 w-7 text-[11px]',
    md: 'avatar h-9 w-9 text-sm',
    lg: 'avatar-lg h-[52px] w-[52px] text-xl',
    xl: 'avatar-xl h-20 w-20 text-[28px]',
  }[size] || 'avatar h-9 w-9 text-sm');

export const avatarImg = 'h-full w-full object-cover';

/* ── Table ───────────────────────────────────────────────────────────────── */

export const tableWrap =
  'table-wrap overflow-x-auto rounded-lg border border-border-subtle [&_table]:w-full [&_table]:border-collapse [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-slate-900/8 [&_th]:bg-gradient-to-b [&_th]:from-[#f2edff] [&_th]:via-[#eef2ff] [&_th]:to-slate-50 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-slate-600/90 [&_td]:border-b [&_td]:border-border-subtle [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_td]:text-sm [&_td]:text-default [&_tbody_tr]:transition-[background] [&_tbody_tr]:duration-[120ms] [&_tbody_tr:hover]:bg-slate-400/4 [&_tbody_tr:last-child_td]:border-b-0';

export const tableThRight = 'text-right';

export const tableRowClickable =
  'cursor-pointer transition-[background,box-shadow] duration-150 hover:bg-purple-500/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-purple-500/35';

export const tdRank = 'w-[30px] text-muted';

export const tdPrimary = 'font-medium text-primary';

export const tdMuted = 'text-[13px] text-muted';

export const cellMuted = 'text-muted';

export const tdRight = 'text-right';

export const tableSubtext = 'mt-0.5 text-xs text-muted';

export const textMuted13 = 'text-[13px] text-muted';

/* ── Pagination ──────────────────────────────────────────────────────────── */

export const pagination =
  'pagination flex items-center justify-center gap-1 py-4';

export const pageBtn =
  'page-btn flex h-9 w-9 min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-sm border border-transparent bg-transparent text-sm text-default transition-all duration-[120ms] hover:bg-slate-400/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35 disabled:cursor-not-allowed disabled:opacity-40 max-[900px]:min-h-11 max-[900px]:min-w-11';

export const pageBtnActive =
  `${pageBtn} active border-transparent bg-accent-gradient text-white`;

/* ── Modal ───────────────────────────────────────────────────────────────── */

export const modalOverlay =
  'modal-overlay fixed inset-0 z-[1000] flex animate-[fadeIn_180ms_ease] items-center justify-center bg-slate-950/75 p-5 backdrop-blur-[4px]';

export const modalSizes = {
  sm: 'modal-sm max-w-[380px]',
  md: 'modal max-w-[520px]',
  lg: 'modal-lg max-w-[720px]',
};

export const modal =
  'modal w-full max-h-[90vh] overflow-y-auto rounded-xl border border-border-soft bg-surface p-7 shadow-lg animate-[slideUp_200ms_ease]';

export const modalHeader =
  'modal-header mb-6 flex items-start justify-between';

export const modalTitle =
  'modal-title text-lg font-semibold text-primary';

export const modalClose =
  'modal-close flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-400/10 text-muted transition-all duration-[120ms] hover:bg-slate-400/20 hover:text-primary';

export const modalFooter =
  'modal-footer mt-7 flex justify-end gap-3 border-t border-border-subtle pt-5';

/* ── Toast ─────────────────────────────────────────────────────────────────── */

export const toastContainer =
  'toast-container pointer-events-none fixed right-6 top-6 z-[9999] flex flex-col gap-2.5';

export const toastBase =
  'toast pointer-events-auto flex min-w-[280px] max-w-[400px] animate-[slideInRight_220ms_ease] items-start gap-3 rounded-md border border-border-soft bg-surface p-3.5 shadow-md';

export const toastType = (type) =>
  ({
    success: 'toast-success border-l-[3px] border-l-green-400 [&_.toast-icon]:text-green-400',
    error: 'toast-error border-l-[3px] border-l-red-400 [&_.toast-icon]:text-red-400',
    warning: 'toast-warning border-l-[3px] border-l-amber-400 [&_.toast-icon]:text-amber-400',
    info: 'toast-info border-l-[3px] border-l-cyan-400 [&_.toast-icon]:text-cyan-400',
  }[type] || '');

export const toastIcon = 'toast-icon mt-px shrink-0';

export const toastBody = 'toast-body flex-1';

export const toastMessage =
  'toast-message text-sm leading-snug text-primary';

export const toastDismiss =
  'toast-dismiss flex shrink-0 cursor-pointer border-0 bg-transparent p-0 text-muted hover:text-default';

/* ── Spinner ─────────────────────────────────────────────────────────────── */

export const spinnerBase =
  'spinner inline-block animate-[spin_0.65s_linear_infinite] rounded-full border-2 border-white/20 border-t-current';

export const spinnerSize = (size) =>
  ({
    sm: 'spinner-sm h-3.5 w-3.5 border-[1.5px]',
    md: 'spinner h-5 w-5',
    lg: 'spinner-lg h-8 w-8 border-[3px]',
  }[size] || 'spinner h-5 w-5');

export const spinnerPage =
  'spinner-page flex min-h-[200px] h-full items-center justify-center [&_.spinner]:h-9 [&_.spinner]:w-9 [&_.spinner]:border-[3px] [&_.spinner]:border-accent [&_.spinner]:border-r-transparent [&_.spinner]:border-b-transparent [&_.spinner]:border-l-transparent';

/* ── Empty state ─────────────────────────────────────────────────────────── */

export const emptyState =
  'empty-state px-6 py-12 text-center text-muted';

export const emptyStateIcon =
  'empty-state-icon mb-3 text-[40px] opacity-50';

export const emptyStateTitle =
  'empty-state-title mb-1.5 text-base font-semibold text-default';

export const emptyStateDesc = 'empty-state-desc text-[13px]';

/* ── Search ──────────────────────────────────────────────────────────────── */

export const searchWrap = 'search-wrap relative';

export const searchIcon =
  'search-icon pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted';

export const searchInput =
  'search-input h-10 w-[260px] rounded-md border border-border-soft bg-white py-0 pl-[38px] pr-3 text-sm text-primary outline-none transition-[border-color,box-shadow] duration-[120ms] placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]';

export const searchInputField = `${searchInput} input-field w-full`;
export const searchInputCombined = `${searchInput} input-field`;

/* ── Divider ─────────────────────────────────────────────────────────────── */

export const divider = 'divider my-5 h-px bg-border-subtle';

/* ── Dropdown / kebab menu ─────────────────────────────────────────────── */

export const dropdownWrap = 'relative';

export const kebabBtn = (open) =>
  `flex h-8 w-8 min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border border-border-subtle text-lg font-bold leading-none text-muted transition-[background,border-color,box-shadow] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35 max-[900px]:min-h-11 max-[900px]:min-w-11 ${
    open ? 'border-purple-500/25 bg-slate-400/8' : 'bg-transparent hover:border-purple-500/15 hover:bg-slate-400/8'
  }`;

export const dropdownPanel =
  'absolute right-0 top-9 z-[100] min-w-[160px] overflow-hidden rounded-[10px] border border-border-subtle bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.10)]';

export const dropdownDivider = 'my-0.5 h-px bg-border-subtle';

export const dropdownItem =
  'flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-3.5 py-[9px] text-left text-[13px] text-primary transition-[background] duration-[120ms] hover:bg-slate-400/8 focus-visible:bg-slate-400/8 focus-visible:outline-none';

export const dropdownItemTone = (tone) =>
  ({
    amber: `${dropdownItem} text-amber-400`,
    green: `${dropdownItem} text-green-400`,
    red: `${dropdownItem} text-red-400`,
  }[tone] || dropdownItem);

/* ── Info row (detail lists) ───────────────────────────────────────────── */

export const infoRow = 'flex gap-3 border-b border-border-subtle py-2.5';

export const infoRowLabel =
  'w-[140px] shrink-0 text-[13px] font-medium text-muted';

export const infoRowValue = 'text-sm text-default';

/* ── Table helpers ───────────────────────────────────────────────────────── */

export const tableActionsCol = 'w-12';

export const tableUserCell = 'flex items-center gap-2.5';

export const tableUserName = 'font-medium text-primary';

export const tableUserEmail = 'text-xs text-muted';

export const tableMeta = 'text-[13px] text-muted';

export const tableMutedSm = 'text-xs text-muted';

export const tableRowActions = 'flex items-center gap-1.5';

export const inputSelectH40 = `${inputSelect} h-10 min-h-10 max-[900px]:min-h-11`;

export const inputSelectW148 = `${inputSelectH40} w-[148px]`;

export const inputSelectW160 = `${inputSelectH40} w-[160px]`;

export const inputSelectFlex = `${inputSelect} min-w-[200px] flex-1`;

/* ── Form helpers ────────────────────────────────────────────────────────── */

export const formStack = 'flex flex-col gap-4';

export const formActions = 'flex gap-2.5 pt-2';

export const formRequired = 'text-red-400';

export const formNarrow = 'mx-auto max-w-[500px]';

/* ── Card detail sections ────────────────────────────────────────────────── */

export const cardProfileHeader = 'mb-6 flex items-center gap-4';

export const cardProfileMeta = 'min-w-0 flex-1';

export const cardProfileName = 'text-lg font-bold text-primary';

export const cardProfileEmail = 'mt-0.5 text-[13px] text-muted';

export const cardProfileBadges = 'mt-2 flex flex-wrap items-center gap-2';

export const cardTitleMb = `${cardTitle} mb-4`;

export const cardTitleMbTight = `${cardTitle} mb-1`;

export const cardSubtitleMb = `${cardSubtitle} mb-6`;

export const cardSection = 'mt-4';

export const cardSectionLabel = 'mb-1.5 text-[13px] text-muted';

export const cardSectionLabelSpaced = 'mb-2 text-[13px] text-muted';

export const cardSectionText = 'text-sm leading-relaxed text-default';

export const cardSectionChips = 'flex flex-wrap gap-1.5';

export const adminPanel =
  'mt-[18px] rounded-md border border-purple-500/25 bg-purple-500/[0.06] p-3.5';

export const adminPanelHeader = 'mb-2.5 flex items-center gap-2';

export const adminPanelTitle = 'text-[13px] font-semibold text-purple-400';

export const adminPanelDesc = 'mb-2.5 text-xs leading-normal text-muted';

export const adminPanelActions = 'flex flex-wrap items-center gap-2';

export const selfRoleNote = 'mt-3.5 text-xs italic text-muted';

export const pageToolbar = 'mb-6 flex gap-3';

export const backBtnMb = 'mb-5';

/* ── My Tickets page ─────────────────────────────────────────────────────── */

export const modalSm480 = `${modal} max-w-[480px]`;

export const alertBoxDanger =
  'mb-[18px] rounded-md border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2.5 text-[13px] leading-normal text-red-400';

export const formStackSm = 'flex flex-col gap-3.5';

export const formActionsEndSm = 'mt-1 flex justify-end gap-2';

export const stackGap3 = 'flex flex-col gap-3';

export const ticketListCard = (status) => {
  const base =
    `${card} flex flex-col !px-6 !py-[18px] transition-[border-color] duration-fast`;
  if (status === 'rejected') return `${base} cursor-default border-red-500/30`;
  if (status === 'reapplied') return `${base} cursor-default border-blue-500/30`;
  return `${base} cursor-pointer hover:border-cyan-400/30`;
};

export const ticketListRow = 'flex items-center gap-5';

export const ticketListIcon = (status) => {
  const base =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-md';
  if (status === 'rejected') return `${base} bg-red-500/10 text-red-400`;
  if (status === 'reapplied') return `${base} bg-blue-500/10 text-blue-400`;
  return `${base} bg-cyan-400/10 text-accent`;
};

export const ticketListTitle = 'text-[15px] font-semibold text-primary';

export const ticketListMeta =
  'mt-[3px] flex flex-wrap items-center gap-2 text-[13px] text-muted';

export const ticketShortCode =
  'rounded bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-accent';

export const ticketListAside = 'flex shrink-0 items-center gap-2.5';

export const ticketListPrice = 'text-sm font-semibold text-primary';

export const ticketNoticeRow = (reapplied) =>
  `mt-3.5 flex items-center gap-2.5 border-t border-border-subtle pt-3.5 text-[13px] ${
    reapplied ? 'text-blue-400' : 'text-red-400'
  }`;

export const ticketReapplyBtn =
  `${btnSm} shrink-0 whitespace-nowrap rounded-lg border border-red-500/30 bg-red-500/12 text-xs font-semibold text-red-400`;

export const ticketDetailPanel =
  `${card} mt-5 border-cyan-400/20 bg-cyan-400/[0.04]`;

export const ticketDetailGrid = (hasQr) =>
  `grid items-start gap-6 ${hasQr ? 'grid-cols-[1fr_200px]' : 'grid-cols-1'}`;

export const ticketCodeBox =
  'mb-3.5 rounded-md border border-cyan-400/35 bg-gradient-to-br from-cyan-400/[0.12] to-cyan-700/[0.06] px-4 py-3.5';

export const ticketCodeLabel =
  'mb-1 text-[11px] uppercase tracking-[0.08em] text-muted';

export const ticketCodeValue =
  'select-all font-mono text-[22px] font-bold tracking-wide text-accent';

export const ticketCodeHint = 'mt-1 text-[11px] text-muted';

export const ticketInfoGrid = 'grid grid-cols-2 gap-x-6 gap-y-2.5';

export const ticketInfoRow = 'border-b border-border-subtle py-2';

export const ticketInfoLabel = 'mb-0.5 text-xs text-muted';

export const ticketInfoValue = 'text-sm text-default';

export const ticketQrPreview =
  'flex flex-col items-center gap-2.5 rounded-md bg-white p-3.5';

export const ticketQrImg = 'block h-[170px] w-[170px]';

export const ticketQrCaption = 'text-center text-[11px] text-slate-600';

export const ticketDetailActions = 'mt-4 flex flex-wrap gap-2.5';

export const qrFullscreenOverlay =
  'fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center bg-black/92 p-5';

export const qrFullscreenPanel =
  'flex max-w-[min(90vw,460px)] cursor-default flex-col items-center gap-4 rounded-xl bg-white p-8';

export const qrFullscreenTitleWrap = 'text-center';

export const qrFullscreenTitle = 'text-lg font-bold text-slate-900';

export const qrFullscreenSubtitle = 'mt-1 text-[13px] text-slate-500';

export const qrFullscreenImg = 'block h-[min(70vw,320px)] w-[min(70vw,320px)]';

export const qrFullscreenHint =
  'max-w-[320px] text-center text-xs leading-normal text-slate-600';

export const qrFullscreenActions = 'flex gap-2';

export const qrFullscreenCloseBtn =
  `${btnSecondarySm} bg-slate-200 text-slate-900`;

export const emptyStateIconMuted = `${emptyStateIcon} text-muted`;

export const codeSm = 'text-[11px]';
