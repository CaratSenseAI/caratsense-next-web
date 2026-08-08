import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deterministic pseudo-random in [-amp, amp]. Stable across renders, so it
 * never causes an SSR hydration mismatch the way Math.random() would.
 */
export function jitter(seed: number, amp: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  // rounded to 3dp: long floats serialise differently on server vs client and
  // trip React's hydration attribute check
  return Math.round((x - Math.floor(x) - 0.5) * 2 * amp * 1000) / 1000
}
