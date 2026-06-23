export const PAGE_SIZE = 20;

export const PODIUM_RANK = {
  1: {
    medal: '🥇',
    medalClass: 'text-[30px]',
    size: 'h-[88px] w-[88px] text-2xl',
    border: 'border-amber-400',
    block: 'h-[88px] bg-gradient-to-b from-amber-400 to-amber-400/35',
    placeholder: '1st',
  },
  2: {
    medal: '🥈',
    medalClass: 'text-2xl',
    size: 'h-[72px] w-[72px] text-xl',
    border: 'border-slate-400',
    block: 'h-[60px] bg-gradient-to-b from-slate-300 to-slate-400/30',
    placeholder: '2nd',
  },
  3: {
    medal: '🥉',
    medalClass: 'text-2xl',
    size: 'h-16 w-16 text-lg',
    border: 'border-amber-700',
    block: 'h-10 bg-gradient-to-b from-amber-700 to-amber-700/30',
    placeholder: '3rd',
  },
};

export const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];
