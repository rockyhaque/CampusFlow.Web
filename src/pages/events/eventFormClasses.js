/** Shared Tailwind classes for Create/Edit event forms (replaces create-event.css). */

export const eventFormShell = 'w-full';

export const eventFormBg =
  'w-full rounded-[22px] border border-slate-900/8 bg-white/72 p-[18px] shadow-[0_18px_52px_rgba(2,6,23,0.08)]';

export const eventCreateGrid =
  'grid grid-cols-[1.05fr_0.95fr] items-start gap-x-[50px] gap-y-4 max-[980px]:grid-cols-1';

export const eventSection = 'p-0 [&+&]:mt-[18px]';

export const eventSectionTitle =
  "mb-3.5 text-sm font-bold tracking-[-0.01em] text-slate-900 after:mt-2.5 after:block after:h-px after:bg-slate-900/8 after:content-['']";

export const eventCoverBottom = 'mt-5 p-0';

export const eventActionsBottom = 'mt-3.5';

export const eventDescription = 'bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.14)]';

export const requiredStar = 'text-red-400';

export const locationChoice = 'mb-2.5 flex flex-wrap items-center gap-3.5';

export const locationPill = (active) =>
  `relative inline-flex cursor-pointer select-none items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-2.5 transition-[border-color,background,box-shadow] duration-[120ms] ${
    active
      ? 'border-violet-500/45 bg-violet-50/85 shadow-[0_10px_24px_rgba(2,6,23,0.08)]'
      : 'border-slate-900/14 bg-white/90 text-slate-800/90 hover:border-violet-500/22 hover:bg-violet-50/55'
  }`;

export const locationPillDot = (active) =>
  `h-4 w-4 rounded-full border-2 shadow-[inset_0_0_0_4px_#fff] ${
    active ? 'border-violet-700/95 bg-violet-700/95' : 'border-slate-500/70 bg-transparent'
  }`;

export const locationPillLabel = 'text-sm font-medium';

export const fieldHint = 'mt-1 text-[11px] text-slate-500';

export const ticketingCheck =
  'mb-4 flex cursor-pointer items-center gap-2.5 [&>input]:h-4 [&>input]:w-4 [&>input]:accent-purple-600 [&>span]:text-sm [&>span]:text-slate-700';

export const ticketingNote =
  'mb-4 rounded-[10px] border-l-[3px] border-l-purple-600 bg-violet-500/[0.06] px-3 py-2 text-[13px] text-slate-500';

export const eventBannerPreview = 'relative overflow-hidden rounded-[10px] border border-slate-900/8';

export const eventBannerImg = (uploading) =>
  `block h-[220px] w-full object-cover${uploading ? ' opacity-60' : ''}`;

export const eventBannerActions = 'absolute top-2.5 right-2.5 flex gap-1.5';

export const eventFileHidden = 'hidden';

export const eventUploadDrop = (uploading) =>
  `flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[10px] border-2 border-dashed border-slate-900/12 bg-violet-500/[0.03] px-5 py-9 transition-[border-color,background] duration-[120ms] hover:border-purple-600 hover:bg-violet-500/[0.06] ${
    uploading ? 'cursor-wait opacity-85' : ''
  }`;

export const eventUploadIcon =
  'flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/12 text-purple-600';

export const eventUploadText = 'text-center';

export const eventUploadTitle = 'text-sm font-medium text-slate-900';

export const eventUploadSub = 'mt-1 text-xs text-slate-500';

export const eventActions = 'flex justify-end gap-2.5';

export const btnWait = 'cursor-wait';

export const paymentTypesGroup = 'my-3 flex flex-col gap-2';

export const paymentTypesLabel =
  'mb-1 text-xs font-semibold uppercase tracking-wider text-muted';

export const paymentTypeOption = (active) =>
  `flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 transition-all duration-150 ${
    active
      ? 'border-violet-500/35 bg-violet-500/5'
      : 'border-border-subtle bg-transparent'
  }`;

export const paymentTypeCheckbox = 'h-4 w-4 accent-accent';

export const paymentTypeTitle = 'text-[13px] font-semibold text-primary';

export const paymentTypeDesc = 'text-[11px] text-muted';
