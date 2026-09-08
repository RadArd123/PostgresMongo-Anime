// Read-only source inspection and optional encrypted-transport migration to an empty Render demo DB.
const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });

async function main() {
  const source = new Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 5432), user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
  });
  try {
    const meta = await source.query('SELECT pg_size_pretty(pg_database_size(current_database())) AS size');
    const tables = (await source.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")).rows;
    console.log('Source database size:', meta.rows[0].size);
    for (const { tablename } of tables) {
      const count = await source.query('SELECT COUNT(*)::int AS count FROM public.' + '"' + tablename.replace(/"/g, '""') + '"');
      console.log(tablename + ': ' + count.rows[0].count);
    }
    if (process.argv[2] !== 'transfer') return;
    const configPath = path.join(__dirname, '../.env.render-demo');
    const targetUrl = require('dotenv').parse(fs.readFileSync(configPath)).TARGET_DATABASE_URL;
    const parsed = new URL(targetUrl);
    if (!parsed.hostname.endsWith('.render.com') || parsed.pathname !== '/pern_anime_demo') {
      throw new Error('Destination must be the designated Render demo database');
    }
    const target = new Pool({ connectionString: targetUrl, ssl: { rejectUnauthorized: true } });
    try {
      const existing = await target.query("SELECT COUNT(*)::int AS count FROM pg_tables WHERE schemaname='public'");
      if (existing.rows[0].count !== 0) throw new Error('Destination is not empty; refusing to overwrite');
      const bin = process.env.PG_BIN || 'C:/Program Files/PostgreSQL/18/bin';
      const backup = path.join(__dirname, '../demo-transfer.dump');
      const sourceEnv = { ...process.env, PGHOST: source.options.host, PGPORT: String(source.options.port),
        PGUSER: source.options.user, PGPASSWORD: source.options.password, PGDATABASE: source.options.database };
      if (process.env.DATABASE_URL) sourceEnv.PGDATABASE = process.env.DATABASE_URL;
      const dump = spawnSync(path.join(bin, 'pg_dump.exe'), ['--format=custom', '--no-owner', '--no-acl', '--schema=public', '--file', backup], { env: sourceEnv });
      if (dump.status !== 0) throw new Error('Source backup failed; no destination changes made');
      // libpq on Windows does not necessarily share Node's trusted root store.
      const caPath = path.join(require('node:os').tmpdir(), 'pern-anime-demo-trusted-roots.pem');
      fs.writeFileSync(caPath, require('node:tls').rootCertificates.join('\n'));
      const targetEnv = { ...process.env, PGHOST: parsed.hostname, PGPORT: parsed.port || '5432',
        PGUSER: decodeURIComponent(parsed.username), PGPASSWORD: decodeURIComponent(parsed.password),
        PGDATABASE: parsed.pathname.slice(1), PGSSLMODE: 'verify-full', PGSSLROOTCERT: caPath };
      const listing = spawnSync(path.join(bin, 'pg_restore.exe'), ['--list', backup], { encoding: 'utf8' });
      if (listing.status !== 0) throw new Error('Could not inspect backup contents');
      const listPath = path.join(require('node:os').tmpdir(), 'pern-anime-demo-restore.list');
      fs.writeFileSync(listPath, listing.stdout.split(/\r?\n/).filter(line => !/\bSCHEMA - public\b/.test(line)).join('\n'));
      const restore = spawnSync(path.join(bin, 'pg_restore.exe'), ['--use-list', listPath, '--no-owner', '--no-acl', '--single-transaction', '--exit-on-error', '--dbname', 'pern_anime_demo', backup], { env: targetEnv });
      if (restore.status !== 0) {
        const detail = String(restore.stderr || restore.error || '').replaceAll(decodeURIComponent(parsed.password), '[redacted]').replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]');
        throw new Error('Restore failed; transaction rolled back. Local backup preserved. ' + detail);
      }
      for (const { tablename } of tables) {
        const sql = 'SELECT COUNT(*)::int AS count FROM public.' + '"' + tablename.replace(/"/g, '""') + '"';
        const [a, b] = await Promise.all([source.query(sql), target.query(sql)]);
        if (a.rows[0].count !== b.rows[0].count) throw new Error('Row count mismatch for ' + tablename);
      }
      console.log('Transfer complete; row counts match. Source was not modified.');
    } finally { await target.end(); }
  } finally { await source.end(); }
}
main().catch(error => { console.error(error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]')); process.exitCode = 1; });
