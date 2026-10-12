# ADR-004: Scope-Relative Offline Service Worker & Static GitHub Pages Export

- **Status**: Accepted
- **Author**: S M Tahosin (@smtahosin)
- **Context**: Hacktoberfest 2026 Week 1 ("Touch Grass") — BreakPoint Architecture
- **Entire Checkpoint**: `cp_bp_04_offline_pwa_export` (`Entire-Checkpoint: 4b92c730ef8912384a7d65b1c0293e84719283f5`)

## Context and Problem Statement
BreakPoint is deployed as a static site to GitHub Pages under `https://smtahosin.github.io/breakpoint/`.
When hosting Next.js static exports under a subpath (e.g. `/breakpoint`):
1. Asset requests like `/images/lake.jpg` fail if they assume root `/`.
2. Hardcoded service worker scopes like `/` fail or clash with other GitHub Pages repositories on the same user domain.
3. Reloading while offline must not crash or display browser 404 error pages.

## Decision
We implemented a **Scope-Relative Offline Caching Strategy**:
1. **Dynamic Service Worker Base Path**:
   `public/sw.js` determines its base path dynamically from `new URL(self.registration.scope).pathname.replace(/\/$/, '')`.
   - In local development: scope is `/`, assets cached under `/`.
   - On GitHub Pages: scope is `/breakpoint/`, assets cached under `/breakpoint/`.
2. **Unified Asset Path Resolver**:
   `src/lib/asset-path.ts` encapsulates `process.env.NEXT_PUBLIC_BASE_PATH || ''` across all image tags and canvas operations.
3. **Next.js Static Export Configuration**:
   `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images: { unoptimized: true }`.
4. **Cache Invalidation & Resilient Fallback**:
   The service worker employs a Stale-While-Revalidate caching pattern for static assets and Network-First with cached root fallback for navigation.

## Trade-Offs Considered
| Dimension | Dynamic Node.js SSR Server | Static Export + PWA Service Worker |
|---|---|---|
| **Hosting Complexity** | Requires Node container / Vercel | Free, fast, immutable static GitHub Pages CDN |
| **Offline Resilience** | Zero offline capability | Full offline capability across all routes |
| **Subpath Portability** | Often breaks behind reverse proxies | Works seamlessly under root or `/breakpoint` |

## Consequences
- The application functions 100% offline once visited.
- Outdoor walkers can refresh their browser or reload without losing active mission instructions.
