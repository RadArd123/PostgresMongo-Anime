import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import type {EpisodeResponse, Episode} from "../interfaces/episodes.types";


export const useEpisodeStore = create<EpisodeResponse>((set) => ({
    episodesById: [],
    episodes: [],
    currentEpisode: null,
    error: null,
    isLoading: false,
    message: null,

    createEpisode:async (episodeData: Partial<Episode>): Promise<void> => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.post("/episodes/createEpisode", episodeData);
            set((state) => ({episodes: [...state.episodes, response.data.episode], message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || "Episode creation failed"});
        } finally {
            set({isLoading: false});
        }
    },
    fetchEpisodesByAnimeId: async (animeId: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.get(`/episodes/episodesByAnime/${animeId}`);
            set({episodesById: response.data.episodes});
        }catch (err: any) {
            set({error: err.response?.data?.message || "Failed to fetch episodes"});
        } finally {
            set({isLoading: false});
        }
    },
    deleteEpisode: async (id: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.delete(`/episodes/deleteEpisode/${id}`);
            set((state) => ({episodesById: state.episodesById.filter((episode) => episode.id !== id),message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || "Failed to delete episode"});
        } finally {
            set({isLoading: false});
        }
    },
    getEpisodeById: async (id: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.get(`/episodes/episode/${id}`);
            set({currentEpisode: response.data.episode});
        }catch (err: any) {
            set({error: err.response?.data?.message || "Failed to fetch episode"});
        } finally {
            set({isLoading: false});
        }
    },
    updateEpisode: async (id: number, episodeData: Partial<Episode>) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.put(`/episodes/updateEpisode/${id}`, episodeData);
            set((state) => ({
                episodesById: state.episodesById.map(ep => ep.id === id ? response.data.episode : ep),
                message: response.data.message
            }));
        }catch (err: any) {
            set({error: err.response?.data?.message || "Failed to update episode"});
        } finally {
            set({isLoading: false});
        }
    },
    resetEpisodes: () => {
        set({episodesById: [], episodes: [], currentEpisode: null, error: null, message: null});
    }
}));