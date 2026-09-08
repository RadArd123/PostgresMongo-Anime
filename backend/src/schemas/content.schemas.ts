import { z } from 'zod';
import { positiveId } from '../middleware/validate';

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();
const optionalNumber = (schema: z.ZodType) => z.preprocess(v => v === '' ? null : v, schema.nullable().optional());
export const webUrl = z.string().trim().url().max(2048).refine(v => /^https?:\/\//i.test(v), 'Use an HTTP or HTTPS URL');
const title = z.string().trim().min(1).max(200);
const rating = optionalNumber(z.coerce.number().min(0).max(10));
export const animeSchema = z.object({ title, description: optionalText(20000), genre: optionalText(100), release_year: optionalNumber(z.coerce.number().int().min(1900).max(2200)) }).strict();
export const episodeSchema = z.object({ anime_id: positiveId, title, duration: optionalNumber(z.coerce.number().int().positive().max(1440)), episode_number: positiveId, video_url: webUrl }).strict();
export const episodeUpdateSchema = episodeSchema.omit({ anime_id: true }).partial().refine(v => Object.keys(v).length > 0, 'Provide at least one field');
export const heroSchema = z.object({ postgres_anime_id: positiveId, title, description: z.string().trim().min(1).max(20000), original_title: optionalText(255), rating }).strict();
export const suggestedSchema = z.object({ postgres_anime_id: positiveId, title, description: optionalText(20000), views_count: optionalText(50), rating, badge_label: optionalText(50) }).strict();
export const newsSchema = z.object({ title, sub_title: optionalText(255), body_text: z.string().trim().min(1).max(50000), related_postgres_anime_id: optionalNumber(positiveId), rating, views_text: optionalText(50), tags: z.union([z.string().max(2000), z.array(z.string().trim().max(100)).max(30)]).nullable().optional() }).strict();
export const badgeSchema = z.object({ name: z.string().trim().min(1).max(100), description: optionalText(2000), icon_url: z.union([webUrl, z.literal('')]).nullable().optional(), color: z.string().regex(/^#[0-9a-f]{6}$/i).optional() }).strict();
