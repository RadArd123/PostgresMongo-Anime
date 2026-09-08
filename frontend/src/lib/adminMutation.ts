import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export function adminMutationFailed(error: unknown, fallback: string): never {
  const message = isAxiosError(error) ? error.response?.data?.message || fallback : fallback;
  toast.error(message);
  throw new Error(message);
}
