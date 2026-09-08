# Temporary Render demo

This deployment serves the compiled frontend and API from one Node service, so
secure same-site login cookies work without purchasing a custom domain.

- Use the Free compute plan only. Leave the root directory empty.
- Build: `npm ci --include=dev --prefix backend && npm run build --prefix backend && npm ci --include=dev --prefix frontend && npm run build --prefix frontend`
- Start: `npm run serve --prefix backend`
- Health check: `/healthz`
- Environment: `NODE_ENV=production`, `SERVE_FRONTEND=true`, `TRUST_PROXY=1`,
  `INIT_DB_ON_START=false`, `VITE_API_URL=/api`, `VITE_SOCKET_URL=/`.
- Set a new generated `JWT_SECRET` and the demo database `DATABASE_URL` privately
  in Render. Use its internal database URL for the server. Do not commit secrets.
- `RENDER_EXTERNAL_URL` supplies the exact allowed origin when serving the frontend.
- Do not configure live Stripe credentials for this demo. Uploads require separately
  configuring Cloudinary credentials; existing media URLs do not require them.

The demo database `pern-anime-demo-db` uses the Free plan and expires October 8,
2026. Free services can sleep when idle. Do not upgrade or enable paid add-ons.

The local migration helper uses a read-only source backup and restores only into
an empty `pern_anime_demo` database on Render, with verified TLS and a single
transaction. It checks row counts afterward. Its `.env.render-demo` and `.dump`
files are ignored by Git. Treat both as private, because the copy contains accounts
and application data. The original database is never changed.
