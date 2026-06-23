export const STATUS_FLOW = { draft: 'published', published: 'ongoing', ongoing: 'completed' };
export const CAN_MANAGE = ['ORGANIZER', 'ADMIN'];

export { fmtDate, fmtTime } from '../../../utils/format.js';

export const STATUS_COLOR = {
  draft: 'amber', published: 'green', ongoing: 'cyan',
  completed: 'slate', cancelled: 'red',
};

export function eventBannerVars(bannerUrl) {
  if (!bannerUrl) return undefined;
  return { '--cf-banner': `url(${bannerUrl})` };
}
