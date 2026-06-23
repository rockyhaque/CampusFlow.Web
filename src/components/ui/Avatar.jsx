import { initials as formatInitials } from '../../utils/format.js';
import { avatarBase, avatarImg, avatarSize } from './componentClasses.js';

const EXTRA_SIZES = {
  feed: 'h-10 w-10 text-[15px] font-bold',
  hero: 'h-[46px] w-[46px] text-base font-bold shadow-[0_4px_14px_rgba(139,92,246,0.25)]',
};

const VARIANT_CLASS = {
  default: avatarBase,
  violet: 'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white',
};

export default function Avatar({
  src,
  photoUrl,
  name,
  size = 'md',
  variant = 'default',
  className = '',
}) {
  const imageSrc = src ?? photoUrl;
  const sizeClass = EXTRA_SIZES[size] || avatarSize(size);
  const variantClass = VARIANT_CLASS[variant] || avatarBase;

  return (
    <div className={`${variantClass} ${sizeClass} ${className}`.trim()}>
      {imageSrc
        ? <img src={imageSrc} alt={name || 'avatar'} className={avatarImg} />
        : formatInitials(name)}
    </div>
  );
}
