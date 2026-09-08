import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import type { NotificationPreferences } from '@/store/notificationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const labels: Record<keyof NotificationPreferences, string> = {
  notify_new_episode: 'Episoade noi', notify_admin_msg: 'Mesaje de la administratori', notify_badge: 'Insigne primite', notify_mention: 'Mențiuni în comunitate', notify_system: 'Anunțuri de sistem',
};
export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const { autoPlayNext, updateSetting } = useSettingsStore();
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    axiosInstance.get('/notifications/preferences', { signal: controller.signal }).then(response => setPreferences(response.data.preferences)).catch(() => { if (!controller.signal.aborted) setError('Setările nu au putut fi încărcate.'); });
    return () => controller.abort();
  }, [revision]);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!preferences) return;
    setSaving(true); setError('');
    try { const response = await axiosInstance.put('/notifications/preferences', preferences); setPreferences(response.data.preferences); toast.success('Setările au fost salvate.'); }
    catch { setError('Salvarea a eșuat. Încearcă din nou.'); }
    finally { setSaving(false); }
  }
  return <div className="min-h-screen bg-[#0a0a0a] text-slate-100 px-4 md:pl-[130px] lg:pl-[150px] md:pr-10 py-10">
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/profile" className="text-sm text-blue-400 hover:underline">Înapoi la profil</Link>
      <h1 className="text-3xl font-black text-white">Setări</h1>
      <form onSubmit={save} className="rounded-2xl bg-[#11131a] border border-white/10 p-6 space-y-5">
        <h2 className="text-lg font-bold">Notificări</h2>
        {error && <p role="alert" className="text-sm text-red-300">{error} <button type="button" className="underline" onClick={() => setRevision(value => value + 1)}>Reîncearcă</button></p>}
        {!preferences && !error && <p role="status">Se încarcă…</p>}
        {preferences && <fieldset disabled={saving} className="space-y-4">
          {(Object.keys(labels) as (keyof NotificationPreferences)[]).map(key => <div key={key} className="flex justify-between items-center gap-4">
            <label htmlFor={key} className="text-sm text-gray-300">{labels[key]}</label>
            <Switch id={key} checked={preferences[key]} onCheckedChange={checked => setPreferences(current => current ? { ...current, [key]: checked } : current)} />
          </div>)}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white" disabled={saving}>{saving ? 'Se salvează…' : 'Salvează'}</Button>
        </fieldset>}
      </form>
      <div className="rounded-2xl bg-[#11131a] border border-white/10 p-6 space-y-3">
        <div className="flex justify-between items-center gap-4"><label htmlFor="auto-next" className="text-sm">Redă automat episodul următor</label><Switch id="auto-next" checked={autoPlayNext} onCheckedChange={checked => updateSetting('autoPlayNext', checked)} /></div>
        <p className="text-xs text-gray-400">Disponibil pentru videoclipurile redate direct. Playerele externe folosesc propriile controale.</p>
      </div>
    </div>
  </div>;
}
