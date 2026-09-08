import {z} from 'zod';

// Definim și exportăm schema pentru înregistrare
export const signupSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters long").max(50),
  email: z.string().trim().email("Must be a valid email").max(100),
  password: z.string().min(8, "Password must be at least 8 characters long").max(128),
}).strict();

// Definim și exportăm schema pentru login
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required").max(128),
}).strict();

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required').max(128),
}).strict();

// Putem chiar să generăm tipurile TypeScript aici, așa cum am discutat
export type SignupUserInput = z.infer<typeof signupSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
