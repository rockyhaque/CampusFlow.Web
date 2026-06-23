/** Shared Tailwind classes for Profile page (replaces profile.css). */

export const profileCoverPatternBg = 'profile-cover-pattern-bg';

export const profileShell = 'w-full';

export const profileCard =
  'mb-5 overflow-hidden rounded-[18px] border border-slate-900/8 bg-white';

export const profileCover =
  'relative h-40 overflow-hidden rounded-t-[18px] bg-gradient-to-br from-violet-500/55 via-fuchsia-500/35 to-indigo-500/45';

export const profileCoverPattern = 'pointer-events-none absolute inset-0';

export const profileHero = 'flex items-end gap-5 px-7 pb-6';

export const profilePhotoWrap = 'relative -mt-11 shrink-0';

export const profilePhotoBtn =
  'absolute bottom-0 right-0 inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-[2.5px] border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)]';

export const profileHeroMeta = 'min-w-0 flex-1 pt-3';

export const profileHeroName =
  'text-[22px] font-extrabold tracking-[-0.02em] text-slate-900';

export const profileHeroSub = 'mt-1 flex flex-wrap items-center gap-2.5';

export const profileHeroEmail = 'text-[13px] text-slate-500';

export const profileTabs =
  'mb-0 flex gap-1 border-b border-slate-900/8 bg-white px-5';

export const profileTab = (active) =>
  `-mb-px cursor-pointer appearance-none border-none border-b-2 bg-transparent px-3.5 py-3 text-[13px] font-semibold transition-colors duration-150 ${
    active
      ? 'border-b-purple-600 text-purple-600'
      : 'border-b-transparent text-slate-500'
  }`;

export const profileBody = 'px-7 pb-7 pt-6';

export const profileGrid =
  'grid grid-cols-2 gap-5 max-[680px]:grid-cols-1';

export const profileSection =
  'rounded-xl border border-slate-900/8 bg-[#fafbfc] px-5 py-[18px]';

export const profileSectionHead =
  'mb-3.5 flex items-center justify-between gap-3 border-b border-slate-900/8 pb-2.5';

export const profileSectionTitle =
  'text-xs font-bold uppercase tracking-[0.06em] text-slate-500';

export const profileEditLink =
  'cursor-pointer appearance-none rounded-full border border-violet-500/25 bg-violet-500/[0.07] px-3 py-1 text-xs font-semibold text-purple-600 transition-colors duration-150 hover:bg-violet-500/14';

export const profileKv = 'flex flex-col gap-3';

export const profileKvRow = 'flex flex-col gap-[3px]';

export const profileK =
  'text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500';

export const profileV = 'min-w-0 text-sm text-slate-700';

export const profileMuted = 'text-[13px] text-slate-500';

export const profileSkillChips = 'flex flex-wrap items-center gap-2';

const profileSkillChipBase =
  'cursor-pointer appearance-none rounded-full border px-3.5 py-[5px] text-xs font-semibold transition-all duration-150';

export const profileSkillChipActive = `${profileSkillChipBase} inline-flex items-center gap-1.5 border-violet-500/30 bg-violet-500/10 text-purple-600`;

export const profileSkillChipEditable = `${profileSkillChipBase} inline-flex items-center gap-1 border-dashed border-slate-900/8 bg-transparent text-slate-500 hover:border-violet-500/40 hover:bg-violet-500/[0.06]`;

export const profilePwCard =
  'max-w-[440px] rounded-xl border border-slate-900/8 bg-[#fafbfc] p-6';

export const profileUnsavedBanner =
  'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between gap-4 whitespace-nowrap rounded-xl border border-amber-400/40 bg-surface px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-[12px]';

export const profileUnsavedBannerInner = 'flex items-center gap-2';

export const profileUnsavedBannerText = 'text-[13px] font-semibold text-amber-400';

export const profileUnsavedBannerActions = 'flex gap-2';

export const profileBannerBtnSm = 'text-xs';

export const profileLeaveOverlay =
  'fixed inset-0 z-[200] flex items-center justify-center bg-black/45';

export const profileLeaveModal =
  'w-[90%] max-w-[400px] rounded-2xl bg-surface px-8 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)]';

export const profileLeaveModalHead = 'mb-3 flex items-center gap-2.5';

export const profileLeaveModalTitle = 'text-base font-bold text-primary';

export const profileLeaveModalBody = 'mb-6 text-sm leading-relaxed text-muted';

export const profileLeaveModalActions = 'flex justify-end gap-2.5';

export const profileHiddenFileInput = 'hidden';

export const profileSkillCount = 'text-[11px] text-muted';

export const profileSkillRemoveBtn =
  'inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-inherit opacity-70';

export const profileSkillAddRow = 'inline-flex items-center gap-1.5';

export const profileSkillAddInput =
  'min-w-[160px] rounded-full border border-accent bg-white px-3 py-1.5 text-xs text-primary outline-none';

export const profileSkillAddBtn = 'px-3 py-1 text-[11px]';

export const profileSkillCancelBtn = 'px-2.5 py-1 text-[11px]';

export const profilePwHeader = 'mb-5 flex items-center gap-2.5';

export const profilePwTitle = 'text-sm font-bold text-primary';

export const profilePwFormStack = 'flex flex-col gap-3.5';

export const profilePwSubmitWrap = 'mt-1.5';
