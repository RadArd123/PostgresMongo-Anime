import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { axiosInstance } from '@/lib/axios';
import { adminMutationFailed } from '@/lib/adminMutation';
import type { EpisodeResponse } from '@/interfaces/episodes.types';

let listRequest = 0;
let episodeRequest = 0;
let selectedAnimeId: number | null = null;
const message = (error: unknown, fallback: string) => isAxiosError(error) ? error.response?.data?.message || fallback : fallback;

export const useEpisodeStore = create<EpisodeResponse>((set) => ({
  episodesById: [], episodes: [], currentEpisode: null, error: null, isLoading: false, message: null,
  createEpisode: async data => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/episodes/createEpisode', data);
      const episode = response.data.episode;
      set(state => ({
        episodes: [...state.episodes, episode],
        episodesById: selectedAnimeId === episode.anime_id ? [...state.episodesById, episode].sort((a, b) => a.episode_number - b.episode_number) : state.episodesById,
        message: response.data.message,
      }));
    } catch (error) {
      set({ error: message(error, 'Episode creation failed') });
      adminMutationFailed(error, 'Episode creation failed');
    } finally { set({ isLoading: false }); }
  },
  fetchEpisodesByAnimeId: async animeId => {
    const request = ++listRequest;
    selectedAnimeId = animeId;
    set({ isLoading: true, error: null, episodesById: [] });
    try {
      const response = await axiosInstance.get(`/episodes/episodesByAnime/${animeId}`);
      if (request === listRequest) set({ episodesById: response.data.episodes });
    } catch (error) {
      if (request === listRequest) set({ error: message(error, 'Failed to load episodes'), episodesById: [] });
    } finally { if (request === listRequest) set({ isLoading: false }); }
  },
  getEpisodeById: async id => {
    const request = ++episodeRequest;
    set({ isLoading: true, error: null, currentEpisode: null });
    try {
      const response = await axiosInstance.get(`/episodes/episode/${id}`);
      if (request === episodeRequest) set({ currentEpisode: response.data.episode });
    } catch (error) {
      if (request === episodeRequest) set({ error: message(error, 'Failed to load episode') });
    } finally { if (request === episodeRequest) set({ isLoading: false }); }
  },
  updateEpisode: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/episodes/updateEpisode/${id}`, data);
      set(state => ({
        episodesById: state.episodesById.map(ep => ep.id === id ? response.data.episode : ep).sort((a, b) => a.episode_number - b.episode_number),
        currentEpisode: state.currentEpisode?.id === id ? response.data.episode : state.currentEpisode,
        message: response.data.message,
      }));
    } catch (error) {
      set({ error: message(error, 'Episode update failed') });
      adminMutationFailed(error, 'Episode update failed');
    } finally { set({ isLoading: false }); }
  },
  deleteEpisode: async id => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/episodes/deleteEpisode/${id}`);
      set(state => ({
        episodesById: state.episodesById.filter(ep => ep.id !== id),
        episodes: state.episodes.filter(ep => ep.id !== id),
        currentEpisode: state.currentEpisode?.id === id ? null : state.currentEpisode,
        message: response.data.message,
      }));
    } catch (error) {
      set({ error: message(error, 'Episode deletion failed') });
      adminMutationFailed(error, 'Episode deletion failed');
    } finally { set({ isLoading: false }); }
  },
  resetEpisodes: () => {
    ++listRequest;
    ++episodeRequest;
    selectedAnimeId = null;
    set({ episodesById: [], episodes: [], currentEpisode: null, error: null, message: null, isLoading: false });
  },
}));
