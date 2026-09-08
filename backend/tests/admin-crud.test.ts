import 'dotenv/config';
import assert from 'node:assert/strict';
import { after, before, mock, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import type { Server } from 'node:http';
import { pool } from '../src/config/db';
import { initDB } from '../src/data/initDB';
import adminRoute from '../src/routes/admin.route';
import animeRoute from '../src/routes/anime.route';
import episodeRoute from '../src/routes/episodes.route';
import featuredRoute from '../src/routes/featured.route';
import badgeRoute from '../src/routes/badge.route';
import notificationRoute from '../src/routes/notification.route';
import favoritesRoute from '../src/routes/favorites.route';
import watchlistRoute from '../src/routes/watchlist.route';
import continueWatchingRoute from '../src/routes/continueWatching.route';
import authRoute from '../src/routes/auth.route';
import profilesRoute from '../src/routes/profiles.route';
import * as uploads from '../src/scripts/uploadToCloudinary';
import * as sockets from '../src/config/socket';

// All application queries are redirected to a uniquely named disposable schema.
// Cloudinary and socket delivery are replaced; PostgreSQL, HTTP, JWT and CRUD are real.
const schema = `codex_test_${randomBytes(8).toString('hex')}`;
// pg deliberately makes password non-enumerable; preserve it explicitly.
const connection = { ...pool.options, password: pool.options.password, connectionString: pool.options.connectionString, connectionTimeoutMillis: 5000 };
const rootPool = new Pool(connection);
const testPool = new Pool({ ...connection, options: `-c search_path=${schema}` });
let server: Server;
let base = '';
let adminCookie = '';
let userCookie = '';
let adminId: number;
let userId: number;
let schemaCreated = false;
let finishPreview: (() => void) | undefined;
const originalSecret = process.env.JWT_SECRET;
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6aUAAAAASUVORK5CYII=', 'base64');

before(async () => {
  try {
  await rootPool.query(`CREATE SCHEMA ${schema}`);
  schemaCreated = true;
  console.log('Isolated test schema:', schema);
  mock.method(pool, 'query', testPool.query.bind(testPool));
  mock.method(pool, 'connect', testPool.connect.bind(testPool));
  mock.method(uploads, 'uploadToCloudinary', async () => 'https://example.com/test-image.png');
  mock.method(sockets, 'getIO', () => ({ to: () => ({ emit: () => undefined }) }));
  process.env.JWT_SECRET = randomBytes(48).toString('hex');
  await initDB();
  const { rows } = await testPool.query("INSERT INTO users (username,email,password,is_admin) VALUES ('test_admin','admin@example.test','unused',true),('test_member','member@example.test','unused',false) RETURNING id");
  [adminId, userId] = rows.map(row => row.id);
  if (process.env.CRUD_BROWSER_PREVIEW === '1') {
    await testPool.query('UPDATE users SET password = $1 WHERE id = $2', [await bcrypt.hash('Testing-Only-123', 12), adminId]);
  }
  adminCookie = `token=${jwt.sign({ id: adminId }, process.env.JWT_SECRET!)}`;
  userCookie = `token=${jwt.sign({ id: userId }, process.env.JWT_SECRET!)}`;
  const app = express();
  app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRoute);
  app.use('/profiles', profilesRoute);
  app.use('/anime-data', featuredRoute);
  app.use('/admin', adminRoute);
  app.use('/animes', animeRoute);
  app.use('/episodes', episodeRoute);
  app.use('/featured', featuredRoute);
  app.use('/badges', badgeRoute);
  app.use('/notifications', notificationRoute);
  app.use('/favorites', favoritesRoute);
  app.use('/watchlist', watchlistRoute);
  app.use('/continue-watching', continueWatchingRoute);
  if (process.env.CRUD_BROWSER_PREVIEW === '1') app.post('/__test/finish', (_req, res) => { res.json({ done: true }); finishPreview?.(); });
  server = await new Promise<Server>(resolve => { const listening = app.listen(0, '127.0.0.1', () => resolve(listening)); });
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  } catch (error) { console.error('Test setup failed:', error); throw error; }
});

after(async () => {
  if (schemaCreated && server && process.env.CRUD_BROWSER_PREVIEW === '1') {
    const animeId = await createAnime('Browser preview anime');
    await request('/episodes/createEpisode', 'POST', { anime_id: animeId, title: 'Preview episode', episode_number: 1, video_url: 'https://example.com/video.mp4' });
    console.log('BROWSER_PREVIEW_URL=' + base);
    console.log('Disposable login: test_admin / Testing-Only-123');
    await new Promise<void>(resolve => { finishPreview = resolve; });
  }
  console.log('Cleaning test schema:', schema);
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  mock.restoreAll();
  await testPool.end();
  if (schemaCreated) {
    assert.match(schema, /^codex_test_[0-9a-f]{16}$/);
    await rootPool.query(`DROP SCHEMA ${schema} CASCADE`);
  }
  await rootPool.end();
  await pool.end();
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

async function request(path: string, method = 'GET', body?: Record<string, unknown> | FormData, cookie = adminCookie) {
  const response = await fetch(base + path, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
  return { status: response.status, body: await response.json() as any };
}
function form(fields: Record<string, unknown>, images: string[]) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, String(value));
  for (const name of images) data.append(name, new Blob([pixel], { type: 'image/png' }), 'pixel.png');
  return data;
}
async function createAnime(title = 'CRUD test anime') {
  const response = await request('/animes/create-anime', 'POST', form({ title, description: 'Test synopsis', genre: 'Action', release_year: 2024 }, ['img_file_icon', 'img_file_banner']));
  assert.equal(response.status, 201, JSON.stringify(response.body));
  return response.body.anime.id as number;
}

test('admin endpoints require authentication and current admin role', async () => {
  assert.equal((await request('/admin/users', 'GET', undefined, '')).status, 401);
  assert.equal((await request('/admin/users', 'GET', undefined, userCookie)).status, 403);
  assert.equal((await request('/animes/create-anime', 'POST', {}, userCookie)).status, 403);
  assert.equal((await request('/admin/users/nope', 'DELETE')).status, 400);
  assert.equal((await request(`/admin/users/${adminId}/role`, 'PUT')).status, 409);
  assert.equal((await request(`/admin/users/${adminId}`, 'DELETE')).status, 409);
});

test('anime and episodes support create, read, edit, images and dependent deletion', async () => {
  const animeId = await createAnime();
  assert.equal((await request(`/animes/${animeId}`)).body.anime.title, 'CRUD test anime');
  const empty = await request(`/episodes/episodesByAnime/${animeId}`);
  assert.equal(empty.status, 200); assert.deepEqual(empty.body.episodes, []);
  const edited = await request(`/animes/update-anime/${animeId}`, 'PUT', { title: 'Edited anime', description: '', genre: '', release_year: null });
  assert.equal(edited.status, 200, JSON.stringify(edited.body));
  assert.equal(edited.body.anime.release_year, null);
  const media = await request(`/admin/media/anime/${animeId}`, 'PUT', form({}, ['img_file_icon']));
  assert.equal(media.status, 200, JSON.stringify(media.body));
  assert.equal(media.body.record.img_url_icon, 'https://example.com/test-image.png');
  const bad = await request('/episodes/createEpisode', 'POST', { anime_id: animeId, title: 'Unsafe', episode_number: 1, video_url: 'javascript:alert(1)' });
  assert.equal(bad.status, 400);
  const created = await request('/episodes/createEpisode', 'POST', { anime_id: animeId, title: 'Pilot', episode_number: 1, duration: 24, video_url: 'https://example.com/video.mp4' });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const episodeId = created.body.episode.id;
  const duplicate = await request('/episodes/createEpisode', 'POST', { anime_id: animeId, title: 'Duplicate', episode_number: 1, video_url: 'https://example.com/video.mp4' });
  assert.equal(duplicate.status, 409);
  const updated = await request(`/episodes/updateEpisode/${episodeId}`, 'PUT', { title: 'Edited pilot', duration: 25 });
  assert.equal(updated.status, 200); assert.equal(updated.body.episode.title, 'Edited pilot');
  assert.equal((await request(`/episodes/episode/${episodeId}`)).body.episode.duration, 25);
  assert.equal((await request(`/episodes/updateEpisode/${episodeId}`, 'PUT', { duration: null })).body.episode.duration, null);
  await testPool.query('INSERT INTO favorites (user_id, anime_id) VALUES ($1,$2)', [userId, animeId]);
  await testPool.query('INSERT INTO watchlists (user_id, anime_id) VALUES ($1,$2)', [userId, animeId]);
  await testPool.query("INSERT INTO reviews (user_id,anime_id,rating,comment) VALUES ($1,$2,8,'Test')", [userId, animeId]);
  await testPool.query('INSERT INTO continue_watching (user_id,anime_id,episode_id) VALUES ($1,$2,$3)', [userId, animeId, episodeId]);
  assert.equal((await request(`/animes/delete-anime/${animeId}`, 'DELETE')).status, 200);
  assert.equal((await request(`/episodes/episode/${episodeId}`)).status, 404);
  assert.equal((await request(`/animes/${animeId}`)).status, 404);
  assert.equal((await request(`/animes/update-anime/${animeId}`, 'PUT', { title: 'Missing' })).status, 404);
});

test('hero, suggestion and news CRUD preserves zero ratings and clears optional fields', async () => {
  const animeId = await createAnime('Featured test anime');
  const cases = [
    { name: 'HeroAnime', list: 'HeroAnimes', key: 'heroAnime', kind: 'hero', image: 'background_image', data: { postgres_anime_id: animeId, title: 'Hero', description: 'Description', original_title: 'Original', rating: 0 } },
    { name: 'SuggestedAnime', list: 'SuggestedAnimes', key: 'suggestedAnime', kind: 'suggestion', image: 'poster_image', data: { postgres_anime_id: animeId, title: 'Suggestion', description: 'Description', badge_label: 'Trending', rating: 0 } },
    { name: 'AnimeNews', list: 'AnimeNews', key: 'animeNews', kind: 'news', image: 'background_image', data: { related_postgres_anime_id: animeId, title: 'News', body_text: 'News body', sub_title: 'Subtitle', tags: 'one,two', rating: 0, views_text: '100' } },
  ];
  for (const item of cases) {
    const created = await request(`/featured/add${item.name}`, 'POST', form(item.data, [item.image]));
    assert.equal(created.status, 201, JSON.stringify(created.body));
    const id = created.body[item.key].id;
    assert.ok((await request(`/featured/get${item.list}`)).body.some((record: { id: number }) => record.id === id));
    const data = { ...item.data, title: 'Updated' } as Record<string, unknown>;
    if (item.kind === 'hero') data.original_title = '';
    if (item.kind === 'news') { data.tags = []; data.related_postgres_anime_id = null; data.sub_title = ''; data.views_text = ''; }
    const updated = await request(`/featured/update${item.name}/${id}`, 'PUT', data);
    assert.equal(updated.status, 200, JSON.stringify(updated.body));
    const record = updated.body[item.key];
    assert.equal(Number(item.kind === 'news' ? record.overlay_stats.rating : record.rating), 0);
    if (item.kind === 'news') { assert.equal(record.sub_title, null); assert.equal(record.related_postgres_anime_id, null); assert.equal(record.tags, null); }
    assert.equal((await request(`/admin/media/${item.kind}/${id}`, 'PUT', form({}, [item.image]))).status, 200);
    assert.equal((await request(`/featured/remove${item.name}/${id}`, 'DELETE')).status, 200);
    assert.equal((await request(`/featured/remove${item.name}/${id}`, 'DELETE')).status, 404);
  }
  await request(`/animes/delete-anime/${animeId}`, 'DELETE');
});

test('users can be created, edited, promoted, demoted and deleted with dependent data', async () => {
  const created = await request('/admin/users', 'POST', { username: 'crud_member', email: 'crud@example.test', password: 'Testing-Only-123' });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.user.password, undefined);
  const id = created.body.user.id;
  const stored = await testPool.query('SELECT password FROM users WHERE id = $1', [id]);
  assert.notEqual(stored.rows[0].password, 'Testing-Only-123');
  assert.equal((await request(`/admin/users/${id}`, 'PUT', { username: 'edited_member', email: 'edited@example.test' })).status, 200);
  assert.equal((await request('/admin/users', 'POST', { username: 'edited_member', email: 'unique@example.test', password: 'Testing-Only-123' })).status, 409);
  const cookie = `token=${jwt.sign({ id }, process.env.JWT_SECRET!)}`;
  assert.equal((await request(`/admin/users/${id}/role`, 'PUT')).status, 200);
  assert.equal((await request('/admin/users', 'GET', undefined, cookie)).status, 200);
  assert.equal((await request(`/admin/users/${id}/role`, 'PUT')).status, 200);
  assert.equal((await request('/admin/users', 'GET', undefined, cookie)).status, 403);
  const animeId = await createAnime('Member dependencies');
  await testPool.query('INSERT INTO favorites (user_id,anime_id) VALUES ($1,$2)', [id, animeId]);
  await testPool.query('INSERT INTO watchlists (user_id,anime_id) VALUES ($1,$2)', [id, animeId]);
  await testPool.query('INSERT INTO reviews (user_id,anime_id,rating) VALUES ($1,$2,8)', [id, animeId]);
  const donation = await testPool.query("INSERT INTO donations (user_id,tier_name,amount) VALUES ($1,'Test',1) RETURNING id", [id]);
  assert.equal((await request(`/admin/users/${id}`, 'DELETE')).status, 200);
  assert.equal((await testPool.query('SELECT user_id FROM donations WHERE id=$1', [donation.rows[0].id])).rows[0].user_id, null);
  assert.equal((await request('/admin/users', 'GET', undefined, cookie)).status, 401);
  await request(`/animes/delete-anime/${animeId}`, 'DELETE');
});

test('badges support create, read, edit, award, revoke and delete', async () => {
  const created = await request('/badges', 'POST', { name: 'CRUD badge', description: 'Test badge', color: '#123456' });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const id = created.body.badge.id;
  const edited = await request(`/badges/${id}`, 'PUT', { name: 'Edited badge', description: '', icon_url: '', color: '#abcdef' });
  assert.equal(edited.status, 200); assert.equal(edited.body.badge.description, null);
  assert.equal((await request('/badges/award', 'POST', { userId, badgeId: id })).status, 201);
  assert.equal((await request(`/badges/user/${userId}`)).body.badges[0].badge_name, 'Edited badge');
  assert.equal((await request('/badges/award', 'POST', { userId, badgeId: id })).status, 409);
  assert.equal((await request(`/badges/user/${userId}/${id}`, 'DELETE')).status, 200);
  assert.equal((await request(`/badges/${id}`, 'DELETE')).status, 200);
  assert.equal((await request(`/badges/${id}`, 'PUT', { name: 'Gone' })).status, 404);
});

test('invalid media and content are rejected without uploading', async () => {
  const animeId = await createAnime('Upload validation');
  const invalid = new FormData();
  invalid.append('img_file_icon', new Blob(['not an image'], { type: 'image/png' }), 'fake.png');
  assert.equal((await request(`/admin/media/anime/${animeId}`, 'PUT', invalid)).status, 415);
  assert.equal((await request(`/admin/media/anime/${animeId}`, 'PUT', form({}, ['unexpected']))).status, 400);
  assert.equal((await request('/animes/create-anime', 'POST', form({ title: ' ' }, ['img_file_icon', 'img_file_banner']))).status, 400);
  assert.equal((await request(`/admin/media/anime/${animeId}`, 'PUT', form({}, ['img_file_icon']), userCookie)).status, 403);
  assert.equal((await request(`/episodes/updateEpisode/123`, 'PUT', { video_url: 'data:text/html,bad' })).status, 400);
  await request(`/animes/delete-anime/${animeId}`, 'DELETE');
});

test('watch progress persists accurately and is private to each member', async () => {
  const animeId = await createAnime('Progress test');
  const created = await request('/episodes/createEpisode', 'POST', { anime_id: animeId, title: 'Progress', episode_number: 1, video_url: 'https://example.com/video.mp4' });
  const episodeId = created.body.episode.id;
  const progress = { animeId, episodeId, progressSeconds: 45, durationSeconds: 1440, completed: false };
  assert.equal((await request('/continue-watching/progress', 'POST', progress, userCookie)).status, 200);
  assert.equal((await request(`/continue-watching/episode/${episodeId}`, 'GET', undefined, userCookie)).body.item.progress_seconds, 45);
  assert.equal((await request(`/continue-watching/episode/${episodeId}`)).body.item, null);
  assert.equal((await request('/continue-watching/progress', 'POST', { ...progress, animeId: animeId + 10000 }, userCookie)).status, 404);
  assert.equal((await request('/continue-watching/progress', 'POST', { ...progress, progressSeconds: -1 }, userCookie)).status, 400);
  await request(`/continue-watching/complete/${episodeId}`, 'PUT', undefined, userCookie);
  assert.equal((await request(`/continue-watching/episode/${episodeId}`, 'GET', undefined, userCookie)).body.item.completed, true);
  await request('/continue-watching/progress', 'POST', { ...progress, progressSeconds: 0 }, userCookie);
  assert.equal((await request(`/continue-watching/episode/${episodeId}`, 'GET', undefined, userCookie)).body.item.completed, false);
  await request(`/animes/delete-anime/${animeId}`, 'DELETE');
});

test('notification preferences persist and disabled categories suppress delivery', async () => {
  const preferences = await request('/notifications/preferences', 'PUT', { notify_badge: false }, userCookie);
  assert.equal(preferences.status, 200);
  assert.equal(preferences.body.preferences.notify_badge, false);
  assert.equal(preferences.body.preferences.notify_admin_msg, true);
  const badge = await request('/badges', 'POST', { name: 'Preference test' });
  const previous = await testPool.query('SELECT count(*)::int AS count FROM notifications WHERE user_id = $1', [userId]);
  assert.equal((await request('/badges/award', 'POST', { userId, badgeId: badge.body.badge.id })).status, 201);
  const current = await testPool.query('SELECT count(*)::int AS count FROM notifications WHERE user_id = $1', [userId]);
  assert.equal(current.rows[0].count, previous.rows[0].count);
  await request(`/badges/${badge.body.badge.id}`, 'DELETE');
});

test('concurrent role changes cannot remove the last administrator', async () => {
  const created = await request('/admin/users', 'POST', { username: 'other_admin', email: 'other@example.test', password: 'Testing-Only-123' });
  const id = created.body.user.id;
  await request(`/admin/users/${id}/role`, 'PUT');
  const cookie = `token=${jwt.sign({ id }, process.env.JWT_SECRET!)}`;
  const results = await Promise.all([
    request(`/admin/users/${id}/role`, 'PUT'),
    request(`/admin/users/${adminId}/role`, 'PUT', undefined, cookie),
  ]);
  assert.ok(results.some(result => result.status === 200));
  assert.ok(results.some(result => result.status === 403 || result.status === 409));
  const remaining = await testPool.query('SELECT count(*)::int AS count FROM users WHERE is_admin = true');
  assert.ok(remaining.rows[0].count >= 1);
  // Restore only the disposable fixture account for cleanup and later tests.
  await testPool.query('UPDATE users SET is_admin = true WHERE id = $1', [adminId]);
  await request(`/admin/users/${id}`, 'DELETE');
});
