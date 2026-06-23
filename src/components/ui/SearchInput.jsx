import Icon from './Icon.jsx';
import {
  searchIcon,
  searchInput,
  searchInputCombined,
  searchInputField,
  searchWrap,
} from './componentClasses.js';

const INPUT_VARIANTS = {
  default: searchInputField,
  compact: searchInput,
  combined: searchInputCombined,
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
  className = '',
  variant = 'default',
  iconSize = 14,
  inputClassName,
  ariaLabel,
}) {
  const inputCls = inputClassName || INPUT_VARIANTS[variant] || searchInputField;

  return (
    <div className={[searchWrap, className].filter(Boolean).join(' ')}>
      <span className={searchIcon}>
        <Icon name="search" size={iconSize} />
      </span>
      <input
        className={inputCls}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || placeholder}
      />
    </div>
  );
}
