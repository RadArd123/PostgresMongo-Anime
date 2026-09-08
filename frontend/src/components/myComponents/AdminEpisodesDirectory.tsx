import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import type { Anime } from '@/interfaces/anime.types';
import type { Episode } from '@/interfaces/episodes.types';

export default function AdminEpisodesDirectory({ animes }: { animes: Anime[] }) {
  const [animeId, setAnimeId] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setEpisodes([]);
    setError('');
    if (!animeId) { setLoading(false); return; }
    setLoading(true);
    axiosInstance.get(`/episodes/episodesByAnime/${animeId}`, { signal: controller.signal })
      .then(response => setEpisodes(response.data.episodes))
      .catch(() => { if (!controller.signal.aborted) setError('Unable to load episodes. Try Refresh.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [animeId, revision]);
  return <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-4">
    <h3 className="text-lg font-bold text-white">Episode Directory</h3>
    <div className="flex flex-wrap gap-3">
      <select aria-label="Choose anime to view episodes" value={animeId} onChange={e => setAnimeId(e.target.value)} className="rounded-xl bg-slate-900 border border-white/10 p-3 text-sm max-w-full">
        <option value="">Select anime…</option>
        {animes.map(anime => <option key={anime.id} value={anime.id}>{anime.title}</option>)}
      </select>
      <button type="button" disabled={loading || !animeId} onClick={() => setRevision(value => value + 1)} className="rounded-xl border border-white/10 px-4 text-sm disabled:opacity-50">Refresh</button>
    </div>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
      {loading ? <p role="status">Loading episodes…</p> : episodes.map(episode => <div key={episode.id} className="flex items-center justify-between gap-4 py-3 text-sm">
        <span className="min-w-0 truncate">EP {episode.episode_number} · {episode.title}</span>
        <Link className="text-blue-400 shrink-0 hover:underline" to={`/anime/episode/${episode.id}`}>Open episode</Link>
      </div>)}
      {!loading && animeId && !error && !episodes.length && <p className="text-sm text-gray-400">No episodes yet. Add the first episode above.</p>}
    </div>
  </div>;
}
