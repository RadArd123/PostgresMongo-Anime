import { useEffect, useRef } from 'react';
import type { Episode } from '@/interfaces/episodes.types';
import { useAuthStore } from '@/store/authStore';
import { useContinueWatchingStore } from '@/store/continueWatchingStore';
import { toast } from 'sonner';

export default function EpisodePlayer({ episode, title, onEnded }: { episode: Episode; title: string; onEnded: () => void }) {
  const authenticated = useAuthStore(state => state.isAuthenticated);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSave = useRef(0);
  const savedPosition = useRef<number | null>(null);
  const directVideo = /\.(mp4|webm|ogg)(?:[?#]|$)/i.test(episode.video_url);
  const validUrl = /^https?:\/\//i.test(episode.video_url);
  const restorePosition = () => {
    const video = videoRef.current;
    if (video && video.readyState >= 1 && savedPosition.current !== null) {
      video.currentTime = Math.min(savedPosition.current, Math.max(0, video.duration - 1));
      savedPosition.current = null;
    }
  };
  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    const store = useContinueWatchingStore.getState();
    store.fetchEpisodeProgress(episode.id).then(item => {
      if (cancelled) return;
      if (item && !item.completed) { savedPosition.current = item.progress_seconds; restorePosition(); }
      if (!item) void store.updateProgress(episode.anime_id, episode.id, 0, (episode.duration || 24) * 60, false);
    }).catch(() => { if (!cancelled) toast.error('Progresul nu a putut fi încărcat.'); });
    return () => { cancelled = true; };
  }, [authenticated, episode.id, episode.anime_id, episode.duration]);

  function saveProgress(force = false, completed = false) {
    const video = videoRef.current;
    if (!authenticated || !video || !Number.isFinite(video.duration)) return;
    if (!force && (video.paused || Date.now() - lastSave.current < 15000)) return;
    lastSave.current = Date.now();
    void useContinueWatchingStore.getState().updateProgress(episode.anime_id, episode.id, Math.floor(video.currentTime), Math.floor(video.duration), completed);
  }
  if (!validUrl) return <p role="alert" className="p-6 text-sm text-red-300">Linkul video nu este valid.</p>;
  return directVideo ? <video ref={videoRef} src={episode.video_url} controls playsInline preload="metadata" aria-label={title} className="absolute inset-0 w-full h-full" onLoadedMetadata={restorePosition} onTimeUpdate={() => saveProgress()} onPause={() => saveProgress(true)} onEnded={() => { saveProgress(true, true); onEnded(); }} onError={() => toast.error('Videoclipul nu poate fi redat. Verifică sursa video.')} /> :
    <iframe src={episode.video_url} title={title} className="absolute inset-0 w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />;
}
