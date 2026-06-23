/** Shared Tailwind classes for app layout (replaces layout-components.css). */

/* ── App shell ─────────────────────────────────────────────────────────── */

export const appShell = 'flex h-screen overflow-hidden';

export const sidebar = (open) =>
  `flex h-screen w-sidebar shrink-0 flex-col overflow-hidden border-r border-slate-900/8 bg-gradient-to-b from-[#f2edff] via-[#eef2ff] to-slate-50 z-[100] transition-[width,transform] duration-[180ms] max-[900px]:fixed max-[900px]:bottom-0 max-[900px]:left-0 max-[900px]:top-topbar max-[900px]:z-[260] max-[900px]:w-[min(288px,88vw)] max-[900px]:max-w-sidebar max-[900px]:-translate-x-full ${
    open ? 'max-[900px]:translate-x-0 max-[900px]:shadow-[8px_0_40px_rgba(15,23,42,0.16)]' : ''
  }`;

export const sidebarBackdrop =
  'fixed bottom-0 left-0 right-0 top-topbar z-[255] m-0 hidden cursor-pointer border-0 bg-slate-900/42 p-0 animate-[fadeIn_150ms_ease] max-[900px]:block';

export const sidebarLogo =
  'box-border flex h-topbar shrink-0 items-center gap-2.5 border-b border-slate-900/[0.06] px-5 no-underline';

export const sidebarNav = 'flex-1 overflow-y-auto py-3';

export const sidebarSection = 'mb-1';

export const sidebarSectionLabel =
  'px-5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600/90';

export const sidebarItem = (active) =>
  `group relative flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-5 py-2.5 text-left text-lg font-normal no-underline transition-all duration-[120ms] ease-linear ${
    active
      ? "bg-violet-500/[0.12] font-medium text-slate-900/92 before:absolute before:bottom-1 before:left-0 before:top-1 before:w-[3px] before:rounded-r-sm before:bg-gradient-to-b before:from-violet-500 before:to-fuchsia-500 before:content-['']"
      : 'text-slate-800/78 hover:bg-violet-500/[0.08] hover:text-slate-900/92'
  }`;

export const sidebarItemIcon = (active) =>
  `flex w-5 shrink-0 items-center justify-center text-base ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`;

export const sidebarItemBadge =
  'ml-auto min-w-[18px] rounded-pill bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-white';

export const sidebarLogoutWrap =
  'shrink-0 border-t border-slate-900/[0.06] p-3 px-2.5';

export const mainContent =
  'flex min-w-0 flex-1 flex-col overflow-hidden bg-page text-base [--overlay-ambient:none]';

/* ── Page layout ───────────────────────────────────────────────────────── */

export const pageContent =
  'flex-1 overflow-y-auto p-7 max-[900px]:px-4 max-[900px]:py-[18px]';

export const pageHeader =
  'mb-6 flex flex-wrap items-start justify-between gap-4';

export const pageTitle =
  'text-[30px] font-bold tracking-tight text-primary max-[900px]:text-[22px]';

export const pageSubtitle =
  'mt-1 text-base text-muted max-[900px]:text-sm';

export const pageActions = 'flex shrink-0 items-center gap-2.5';

export const statsGrid =
  'mb-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]';

export const statsGridInner =
  'mb-[18px] grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]';

export const chartsGrid =
  'mt-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]';

export const chartsGridMb =
  'mb-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]';

export const chartsGridWide =
  'mt-5 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]';

export const contentGrid =
  'grid grid-cols-2 gap-5 max-[900px]:grid-cols-1';

export const eventDetailGrid = 'max-[900px]:!grid-cols-1';

export const filterBar =
  'mb-5 flex flex-wrap items-center gap-2.5 [&_.search-input]:w-full [&_.search-wrap]:min-w-[200px] [&_.search-wrap]:flex-1';

export const formGrid =
  'grid grid-cols-2 gap-4 max-[600px]:grid-cols-1';

export const formGridSpan2 = 'col-span-2 max-[600px]:col-span-1';

/* ── Auth layout ───────────────────────────────────────────────────────── */

export const authShell =
  'block min-h-screen w-full bg-page bg-fixed bg-image-ambient p-0';

export const authSplit =
  'grid min-h-screen w-full grid-cols-2 border-0 shadow-none max-[900px]:min-h-screen max-[900px]:grid-cols-1';

export const authLeft =
  'relative max-[900px]:hidden overflow-hidden bg-[linear-gradient(135deg,rgba(2,6,23,0.15),rgba(2,6,23,0.65)),url(/campus.jpg)] bg-cover bg-center';

export const authLeftOverlay =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_40%,rgba(34,211,238,0.22),transparent_60%)]';

export const authRight =
  'flex items-center justify-center overflow-y-auto bg-white px-[60px] py-14 text-slate-700 max-[900px]:px-[22px] max-[900px]:py-7 [--bg-surface:#fff] [--bg-surface-2:var(--slate-50)] [--text-primary:var(--slate-900)] [--text-default:var(--slate-700)] [--text-muted:var(--slate-500)] [--border-soft:rgba(15,23,42,0.14)] [--border-subtle:rgba(15,23,42,0.1)] [&_.input-field]:border [&_.input-field]:border-slate-900/14 [&_.input-field]:bg-slate-50 [&_.input-field]:text-slate-900 [&_.input-field::placeholder]:text-slate-400 [&_.input-icon]:text-slate-400 [&_.input-icon-right]:text-slate-400 [&_.input-icon-right:hover]:text-slate-600 [&_.input-label]:text-slate-700';

export const authCard =
  'w-full max-w-[420px] animate-[slideUp_220ms_ease] border-0 bg-transparent p-0 shadow-none';

export const authLogo = 'mb-[22px] flex items-center gap-3';

export const authTitle =
  'mb-1.5 text-2xl font-bold tracking-tight text-slate-900';

export const authSubtitle = 'mb-8 text-sm text-slate-600';

export const authForm = 'flex flex-col gap-[18px]';

export const authFooter =
  'mt-6 text-center text-[13px] text-slate-600 [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_a]:decoration-slate-900/25 [&_a]:underline-offset-[3px]';

export const authError =
  'flex items-start gap-2 rounded-md border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-[13px] text-red-400';
