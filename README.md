# Sebastian Lopez — Engineering Portfolio

Next.js App Router, Tailwind CSS, GSAP, and a local WebGL shader. The portfolio lives at `/`, with separate `/projects`, `/about`, `/experience`, and `/contact` pages. Project detail pages contain uploaded galleries, reports, and CAD files.

The personal site uses a shared `--accent` token: purple in light mode and dark orange in dark mode. Large content panels use a cursor-reactive Border Glow adaptation; compact pills, buttons, chips, and circular controls use a Glass Surface adaptation with accent highlights. Both are implemented locally from the official React Bits interaction models.

Run `pnpm install`, `pnpm build`, then `pnpm start`. For the current local preview use http://localhost:3001. `node dev-server.cjs` provides an in-process development fallback on port 3001.

Edit personal content in `app/content/portfolio-source.json`; page structure is in `app/personal.js` and styling in `app/personal.css`. Assets copied from the source portfolio live in `public/portfolio/assets`. The original source project remains unchanged. The vending-machine entry has no uploaded images or downloads, so none are shown. Unfinished project outcomes and template client testimonials are omitted.

The reference reconstruction is preserved at `/reference` in `app/portfolio.js`, `app/reference.css`, and the responsive section trees under `app/content`. It includes native FAQ, menu, carousel, tickers, spring entrances, and hover motion. The requested 95% visual and motion fidelity has not yet been established by full comparison; do not interpret the personalized pages as an exact reproduction.
