
export interface IHeroAnime {
    id: number;
    postgres_anime_id: number;
    title: string;
    description: string;
    original_title?: string;
    rating: number;
    background_image: string;
    created_at: Date;
}

export interface IHeroAnimeResponse {
    heroAnimes: IHeroAnime[];
    isLoading: boolean;
    error: string | null;
    message?: string | null;
    addHeroAnime: (heroAnimeData: Partial<IHeroAnime>) => Promise<void>;
    getHeroAnimes: () => Promise<void>;
    removeHeroAnime: (id: number) => Promise<void>;
    updateHeroAnime: (id: number, data: Partial<IHeroAnime>) => Promise<void>;
}