import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Inline SVG placeholder used when an asset in `public/` is missing,
 * so a half-populated project still renders instead of showing broken
 * image icons. Mirrors the reference site's `onerror` fallback.
 */
export function placeholder(label: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
    <rect width="600" height="400" fill="${color}"/>
    <text x="50%" y="50%" fill="#ffffff" font-family="Arial,Helvetica,sans-serif"
      font-size="44" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
