import type { Response } from 'express';
import type { ExtendedRequest } from '../interfaces/request.types';
import type { UploadedFile } from 'express-fileupload';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { crudError } from '../utils/crudError';
import { uploadToCloudinary } from '../scripts/uploadToCloudinary';

export async function createUser(req: ExtendedRequest, res: Response) {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    // New accounts start as users; promotion remains an explicit admin action.
    const { rows } = await pool.query('INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, false) RETURNING id, username, email, is_admin', [username, email, hash]);
    res.status(201).json({ success: true, user: rows[0], message: 'User created' });
  } catch (error) { crudError(res, error, 'Unable to create user'); }
}

export async function updateUser(req: ExtendedRequest, res: Response) {
  try {
    const { username, email } = req.body;
    const { rows } = await pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, is_admin', [username, email, Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user: rows[0], message: 'User updated' });
  } catch (error) { crudError(res, error, 'Unable to update user'); }
}

const mediaTargets = {
  anime: { table: 'animes', fields: { img_file_icon: 'img_url_icon', img_file_banner: 'img_url_banner' } },
  hero: { table: 'hero_anime', fields: { background_image: 'background_image' } },
  suggestion: { table: 'suggested_anime', fields: { poster_image: 'poster_image' } },
  news: { table: 'anime_news', fields: { background_image: 'background_image' } },
} as const;

export async function updateMedia(req: ExtendedRequest, res: Response) {
  const target = mediaTargets[req.params.kind as keyof typeof mediaTargets];
  if (!target) return res.status(404).json({ message: 'Unknown media category' });
  const files = Object.entries(req.files || {});
  if (!files.length || files.some(([name, file]) => !(name in target.fields) || Array.isArray(file))) {
    return res.status(400).json({ message: 'Select an image for the requested content' });
  }
  try {
    const id = Number(req.params.id);
    const exists = await pool.query(`SELECT id FROM ${target.table} WHERE id = $1`, [id]);
    if (!exists.rows[0]) return res.status(404).json({ message: 'Content not found' });
    const values = await Promise.all(files.map(([, file]) => uploadToCloudinary(file as UploadedFile)));
    const fields: Record<string, string> = target.fields;
    const assignments = files.map(([name], i) => `${fields[name]} = $${i + 1}`);
    const { rows } = await pool.query(`UPDATE ${target.table} SET ${assignments.join(', ')} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
    if (!rows[0]) return res.status(404).json({ message: 'Content no longer exists' });
    res.json({ success: true, message: 'Images updated', record: rows[0] });
  } catch (error) { crudError(res, error, 'Unable to update images'); }
}

export async function updateBadge(req: ExtendedRequest, res: Response) {
  try {
    const { name, description, icon_url, color } = req.body;
    const { rows } = await pool.query('UPDATE badges SET name = $1, description = $2, icon_url = $3, color = $4 WHERE id = $5 RETURNING *', [name, description || null, icon_url || null, color || '#FFD700', Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ message: 'Badge not found' });
    res.json({ message: 'Badge updated', badge: rows[0] });
  } catch (error) { crudError(res, error, 'Unable to update badge'); }
}

export async function revokeBadge(req: ExtendedRequest, res: Response) {
  try {
    const { rowCount } = await pool.query('DELETE FROM user_badges WHERE user_id = $1 AND badge_id = $2', [Number(req.params.userId), Number(req.params.badgeId)]);
    if (!rowCount) return res.status(404).json({ message: 'Badge assignment not found' });
    res.json({ message: 'Badge revoked' });
  } catch (error) { crudError(res, error, 'Unable to revoke badge'); }
}
