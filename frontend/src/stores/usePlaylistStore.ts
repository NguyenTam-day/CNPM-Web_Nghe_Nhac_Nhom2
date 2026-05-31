import { axiosInstance } from "@/lib/axios";
import { Playlist, Song } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface PlaylistStore {
	playlists: Playlist[];
	favorites: Song[];
	currentPlaylist: Playlist | null;
	isLoading: boolean;
	error: string | null;

	fetchPlaylists: () => Promise<void>;
	fetchPlaylistById: (id: string) => Promise<void>;
	createPlaylist: (name: string, description?: string, imageUrl?: string) => Promise<Playlist | null>;
	updatePlaylist: (id: string, name: string, description?: string, imageUrl?: string) => Promise<void>;
	deletePlaylist: (id: string) => Promise<void>;
	addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
	removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
	fetchFavorites: () => Promise<void>;
	toggleFavorite: (song: Song) => Promise<void>;
	isFavorite: (songId: string) => boolean;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
	playlists: [],
	favorites: [],
	currentPlaylist: null,
	isLoading: false,
	error: null,

	fetchPlaylists: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/playlists");
			set({ playlists: response.data });
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			set({ error: errorMsg });
			console.error("Error in fetchPlaylists", error);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPlaylistById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/playlists/${id}`);
			set({ currentPlaylist: response.data });
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			set({ error: errorMsg });
			console.error("Error in fetchPlaylistById", error);
		} finally {
			set({ isLoading: false });
		}
	},

	createPlaylist: async (name, description = "", imageUrl = "") => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/playlists", { name, description, imageUrl });
			set((state) => ({
				playlists: [response.data, ...state.playlists],
			}));
			toast.success("Playlist created successfully");
			return response.data;
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to create playlist: " + errorMsg);
			return null;
		} finally {
			set({ isLoading: false });
		}
	},

	updatePlaylist: async (id, name, description = "", imageUrl = "") => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.put(`/playlists/${id}`, { name, description, imageUrl });
			set((state) => ({
				playlists: state.playlists.map((pl) => (pl._id === id ? response.data : pl)),
				currentPlaylist: state.currentPlaylist?._id === id ? response.data : state.currentPlaylist,
			}));
			toast.success("Playlist updated successfully");
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to update playlist: " + errorMsg);
		} finally {
			set({ isLoading: false });
		}
	},

	deletePlaylist: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/playlists/${id}`);
			set((state) => ({
				playlists: state.playlists.filter((pl) => pl._id !== id),
				currentPlaylist: state.currentPlaylist?._id === id ? null : state.currentPlaylist,
			}));
			toast.success("Playlist deleted successfully");
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to delete playlist: " + errorMsg);
		} finally {
			set({ isLoading: false });
		}
	},

	addSongToPlaylist: async (playlistId, songId) => {
		try {
			const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
			set((state) => ({
				playlists: state.playlists.map((pl) => (pl._id === playlistId ? response.data : pl)),
				currentPlaylist: state.currentPlaylist?._id === playlistId ? response.data : state.currentPlaylist,
			}));
			toast.success("Song added to playlist");
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to add song: " + errorMsg);
		}
	},

	removeSongFromPlaylist: async (playlistId, songId) => {
		try {
			const response = await axiosInstance.delete(`/playlists/${playlistId}/songs`, { data: { songId } });
			set((state) => ({
				playlists: state.playlists.map((pl) => (pl._id === playlistId ? response.data : pl)),
				currentPlaylist: state.currentPlaylist?._id === playlistId ? response.data : state.currentPlaylist,
			}));
			toast.success("Song removed from playlist");
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to remove song: " + errorMsg);
		}
	},

	fetchFavorites: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/favorites");
			set({ favorites: response.data });
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			set({ error: errorMsg });
			console.error("Error in fetchFavorites", error);
		} finally {
			set({ isLoading: false });
		}
	},

	toggleFavorite: async (song) => {
		const isFav = get().isFavorite(song._id);
		try {
			if (isFav) {
				await axiosInstance.delete("/favorites", { data: { songId: song._id } });
				set((state) => ({
					favorites: state.favorites.filter((s) => s._id !== song._id),
				}));
				toast.success("Removed from Favorites");
			} else {
				await axiosInstance.post("/favorites", { songId: song._id });
				set((state) => ({
					favorites: [...state.favorites, song],
				}));
				toast.success("Added to Favorites");
			}
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message;
			toast.error("Failed to toggle favorite: " + errorMsg);
		}
	},

	isFavorite: (songId) => {
		return get().favorites.some((s) => s._id === songId);
	},
}));
