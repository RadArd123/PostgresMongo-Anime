import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import AdminRecordDialog from './AdminRecordDialog';

export default function BadgeAssignments({ users }: { users: { id: number; username: string }[] }) {
  const [userId, setUserId] = useState('');
  const [badges, setBadges] = useState<{ badge_id: number; badge_name: string }[]>([]);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setBadges([]);
    setError('');
    if (userId) axiosInstance.get(`/badges/user/${userId}`, { signal: controller.signal })
      .then(response => setBadges(response.data.badges))
      .catch(() => { if (!controller.signal.aborted) setError('Unable to load assigned badges.'); });
    return () => controller.abort();
  }, [userId, revision]);
  return <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-4">
    <h3 className="font-bold">Assigned Badges</h3>
    <select aria-label="Select user to manage badges" value={userId} onChange={event => setUserId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm">
      <option value="">Choose a user…</option>
      {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
    </select>
    <button type="button" onClick={() => setRevision(value => value + 1)} disabled={!userId} className="text-sm text-blue-400 disabled:opacity-50">Refresh assignments</button>
    {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
    {badges.map(badge => <p key={badge.badge_id} className="text-sm text-gray-300">{badge.badge_name}</p>)}
    {userId && <AdminRecordDialog key={userId} title="Revoke Badge" description="Remove a badge assigned to this user" destructive records={badges.map(badge => ({ id: badge.badge_id, title: badge.badge_name }))} onSave={async id => {
      await axiosInstance.delete(`/badges/user/${userId}/${id}`);
      setRevision(value => value + 1);
      toast.info('The badge remains available to award again.');
    }} />}
  </div>;
}
