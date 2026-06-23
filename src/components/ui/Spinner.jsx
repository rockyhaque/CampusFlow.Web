import { spinnerBase, spinnerPage, spinnerSize } from './componentClasses.js';
import { cfSpinnerColor } from '../../utils/cfDynamic.js';

export function Spinner({ size = 'md', color }) {
  return (
    <span
      className={`${spinnerBase} ${spinnerSize(size)}${color ? ' cf-var-spinner' : ''}`}
      style={cfSpinnerColor(color)}
    />
  );
}

export function PageSpinner() {
  return (
    <div className={spinnerPage}>
      <Spinner size="lg" />
    </div>
  );
}
