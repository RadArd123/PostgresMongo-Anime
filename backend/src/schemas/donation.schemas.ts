import { z } from 'zod';

export const checkoutSessionSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .min(1, 'Donation must be at least $1')
    .max(1_000, 'Donation cannot exceed $1,000')
    .refine(
      (amount) => Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-8,
      'Use at most two decimal places'
    ),
  donor_name: z.string().trim().max(100).optional().default('Anonymous'),
  message: z.string().trim().max(500).optional().default(''),
}).strict();
