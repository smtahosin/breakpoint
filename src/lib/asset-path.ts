/**
 * BreakPoint Asset Path Resolver
 * Ensures asset paths resolve cleanly under both root (development)
 * and GitHub Pages subpaths (e.g. /breakpoint) during static export.
 */

export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
