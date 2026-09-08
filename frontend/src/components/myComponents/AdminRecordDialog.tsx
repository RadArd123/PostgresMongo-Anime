import { useId, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ActionCard from './ActionCard';

export interface AdminField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'file' | 'color' | 'textarea';
  required?: boolean;
  maxLength?: number;
  minLength?: number;
}
export interface AdminRecord { id: number; title: string; values?: Record<string, string>; }
interface Props {
  title: string;
  description: string;
  records?: AdminRecord[];
  fields?: AdminField[];
  destructive?: boolean;
  onSave: (id: number | null, data: FormData) => Promise<void>;
}

export default function AdminRecordDialog({ title, description, records, fields = [], destructive, onSave }: Props) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const selected = records?.find(record => String(record.id) === selectedId);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || (records && !selected)) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      await onSave(selected ? selected.id : null, data);
      toast.success(destructive ? 'Deleted successfully' : 'Saved successfully');
      setOpen(false);
      setSelectedId('');
    } catch (cause) {
      setError(isAxiosError(cause) ? cause.response?.data?.message || 'Unable to save. Please try again.' : cause instanceof Error ? cause.message : 'Unable to save. Please try again.');
    } finally { setPending(false); }
  }
  return (
    <Dialog open={open} onOpenChange={value => { if (!pending) { setOpen(value); setError(''); setSelectedId(''); } }}>
      <DialogTrigger asChild><ActionCard title={title} subtitle={description} /></DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90dvh] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl text-white rounded-2xl border-white/10">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription className="text-slate-400">{description}</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          {records && <div className="space-y-2">
            <label htmlFor={`${formId}-record`} className="text-sm text-slate-300">Select record</label>
            <select id={`${formId}-record`} required disabled={pending} value={selectedId} onChange={e => { setSelectedId(e.target.value); setError(''); }} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm">
              <option value="">{records.length ? 'Choose a record…' : 'No records available'}</option>
              {records.map(record => <option key={record.id} value={record.id}>{record.title}</option>)}
            </select>
          </div>}
          {(!records || selected) && <fieldset disabled={pending} key={selectedId} className="space-y-4">
            {fields.map(field => <div key={field.name} className="space-y-2">
              <label htmlFor={`${formId}-${field.name}`} className="text-sm text-slate-300">{field.label}{field.required ? ' *' : ''}</label>
              {field.type === 'textarea' ? <textarea id={`${formId}-${field.name}`} name={field.name} required={field.required} maxLength={field.maxLength} defaultValue={selected?.values?.[field.name] || ''} rows={4} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm" /> :
                <Input id={`${formId}-${field.name}`} name={field.name} type={field.type || 'text'} required={field.required} minLength={field.minLength} maxLength={field.maxLength} autoComplete={field.type === 'password' ? 'new-password' : 'off'} accept={field.type === 'file' ? 'image/png,image/jpeg,image/webp,image/gif' : undefined} defaultValue={field.type === 'file' ? undefined : selected?.values?.[field.name] || (field.type === 'color' ? '#6366f1' : '')} className="bg-black/40 border-white/10 rounded-xl" />}
            </div>)}
          </fieldset>}
          {destructive && selected && <p className="text-sm text-red-300">Permanently delete “{selected.title}”? This cannot be undone.</p>}
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)} className="bg-white/5 border-white/10">Cancel</Button>
            <Button type="submit" disabled={pending || Boolean(records && !selected)} className={destructive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}>{pending ? 'Saving…' : destructive ? 'Delete' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
