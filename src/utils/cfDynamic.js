/** CSS custom-property helpers for dynamic values backed by cf-var-* utilities. */

export function cfVars(vars) {
  if (!vars) return undefined;
  const style = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value != null && value !== '') style[`--cf-${key}`] = value;
  }
  return Object.keys(style).length ? style : undefined;
}

export function cfProgress(pct) {
  return cfVars({ progress: `${pct}%` });
}

export function cfBanner(url) {
  return url ? cfVars({ banner: `url(${url})` }) : undefined;
}

export function cfBg(color) {
  return color ? cfVars({ bg: color }) : undefined;
}

export function cfHeight(px) {
  return cfVars({ h: `${px}px` });
}

export function cfWidth(px) {
  return cfVars({ w: typeof px === 'number' ? `${px}px` : px });
}

export function cfSpinnerColor(color) {
  return color ? cfVars({ 'spinner-color': color }) : undefined;
}
