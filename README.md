# Agora Showcase

Reduced frontend portfolio edition of Agora, built with Next.js App Router, React and TypeScript.
All companies, prices and headlines are fictional. This is an interface demonstration.

## Quick start

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. No account, environment file or API key needed.
Installing dependencies requires internet. The running interface uses local assets only.
The development server runs on loopback; no remote backend is included.
`npm run build` produces static files in `out/` that need only a static file server.

## Features

Select companies, search the fictional catalogue, change sample chart ranges, and save
favourites in browser localStorage. Clear site data to reset favourites. Responsive
layout, keyboard controls and reduced-motion-aware canvas particles are included.
Charts show deterministic sample observations; changes are illustrative daily values.

## Reduced scope

No login, profiles, passwords, database, email, jobs, live APIs, remote fonts,
analytics, external images or TradingView embeds. The private full application has
additional integrations; this sample only demonstrates frontend work.

## Structure

- app/: static page, layout and styles
- components/: interactive dashboard and particle canvas
- lib/sample-data.ts: deterministic fictional fixtures
- scripts/check-source.mjs: publication source guard

## Checks

```sh
npm run lint
npm run typecheck
npm run check:source
npm run build
```

CI runs these without credentials. No personal records or credentials are bundled.

## License

MIT for this sample's source. Dependencies keep their respective licences.
No real company logos, third-party artwork or market data are bundled.
