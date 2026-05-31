import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Heart, Trash2, ListMusic } from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Song } from "@/types";
import { SignedIn } from "@clerk/clerk-react";

interface SongActionMenuProps {
	song: Song;
	playlistId?: string;
}

export const SongActionMenu = ({ song, playlistId }: SongActionMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showPlaylists, setShowPlaylists] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const {
		playlists,
		addSongToPlaylist,
		removeSongFromPlaylist,
		toggleFavorite,
		isFavorite,
	} = usePlaylistStore();

	const isFav = isFavorite(song._id);

	// Close menu on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setShowPlaylists(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleFavorite(song);
		setIsOpen(false);
	};

	const handleAddToPlaylist = (e: React.MouseEvent, targetPlaylistId: string) => {
		e.stopPropagation();
		addSongToPlaylist(targetPlaylistId, song._id);
		setIsOpen(false);
		setShowPlaylists(false);
	};

	const handleRemoveFromPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (playlistId) {
			removeSongFromPlaylist(playlistId, song._id);
		}
		setIsOpen(false);
	};

	return (
		<SignedIn>
			<div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(!isOpen);
						setShowPlaylists(false);
					}}
					className="p-2 hover:bg-zinc-800 hover:text-white rounded-full text-zinc-400 transition-colors focus:outline-none"
					title="More options"
				>
					<MoreHorizontal className="h-5 w-5" />
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-56 rounded-md bg-zinc-950 border border-zinc-800 shadow-xl z-50 py-1 text-sm text-zinc-300 animate-in fade-in duration-100">
						{/* Toggle Favorite Option */}
						<button
							onClick={handleToggleFavorite}
							className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center gap-3 transition-colors text-left"
						>
							<Heart className={`h-4 w-4 ${isFav ? "fill-green-500 text-green-500" : ""}`} />
							<span>{isFav ? "Remove from Liked Songs" : "Save to Liked Songs"}</span>
						</button>

						{/* Add to Playlist Expandable Option */}
						<div className="relative group/sub">
							<button
								onMouseEnter={() => setShowPlaylists(true)}
								onClick={(e) => {
									e.stopPropagation();
									setShowPlaylists(!showPlaylists);
								}}
								className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center justify-between gap-3 transition-colors text-left"
							>
								<div className="flex items-center gap-3">
									<ListMusic className="h-4 w-4" />
									<span>Add to Playlist</span>
								</div>
								<span className="text-[10px] text-zinc-500">▶</span>
							</button>

							{showPlaylists && (
								<div className="absolute right-full top-0 mr-1 w-52 rounded-md bg-zinc-950 border border-zinc-800 shadow-xl py-1 z-50 max-h-48 overflow-y-auto">
									{playlists.length === 0 ? (
										<div className="px-4 py-2 text-xs text-zinc-500">No playlists found</div>
									) : (
										playlists.map((pl) => (
											<button
												key={pl._id}
												onClick={(e) => handleAddToPlaylist(e, pl._id)}
												className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white text-left truncate block text-xs"
											>
												{pl.name}
											</button>
										))
									)}
								</div>
							)}
						</div>

						{/* Remove from current playlist Option (if applicable) */}
						{playlistId && (
							<>
								<div className="h-[1px] bg-zinc-800 my-1" />
								<button
									onClick={handleRemoveFromPlaylist}
									className="w-full px-4 py-2 hover:bg-red-950/40 hover:text-red-400 text-red-500 flex items-center gap-3 transition-colors text-left"
								>
									<Trash2 className="h-4 w-4" />
									<span>Remove from Playlist</span>
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</SignedIn>
	);
};
export default SongActionMenu;
