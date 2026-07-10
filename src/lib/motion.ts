export const prefersReducedMotion = (): boolean =>
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export const motionDuration = (duration: number): number =>
  prefersReducedMotion() ? 0 : duration;
