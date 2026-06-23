export const LOGO_URL = 'https://res.cloudinary.com/dnpun8jzt/image/upload/v1778610617/logo-campusflow_lsgadq.png';

const SIZE = {
  sm: {
    root: 'gap-2',
    img: 'size-8',
    name: 'text-sm',
    sub: 'text-[9px]',
  },
  md: {
    root: 'gap-2.5',
    img: 'size-9',
    name: 'text-base',
    sub: 'text-[10px]',
  },
  lg: {
    root: 'gap-3',
    img: 'size-[46px]',
    name: 'text-[22px]',
    sub: 'text-[11px]',
  },
};

export default function AppLogo({ size = 'md', variant = 'full' }) {
  const subText = size === 'lg' ? 'University Volunteer Management' : 'UVMS';
  const sz = size === 'sm' || size === 'lg' ? size : 'md';
  const s = SIZE[sz];

  return (
    <div className={`flex items-center no-underline ${s.root}`}>
      <img
        src={LOGO_URL}
        alt="CampusFlow"
        className={`block shrink-0 object-contain ${s.img}`}
      />

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className={`font-bold leading-[1.1] tracking-tight text-violet-700 ${s.name}`}>
            CampusFlow
          </div>
          <div className={`mt-0.5 leading-none tracking-widest text-accent uppercase ${s.sub}`}>
            {subText}
          </div>
        </div>
      )}
    </div>
  );
}
