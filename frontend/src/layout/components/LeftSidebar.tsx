import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useChatStore } from "@/stores/useChatStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Plus, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading: isMusicLoading } = useMusicStore();
	const { playlists, fetchPlaylists, createPlaylist, fetchFavorites, favorites, isLoading: isPlaylistLoading } = usePlaylistStore();
	const { unreadUsers } = useChatStore();
	const navigate = useNavigate();

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	useEffect(() => {
		// Only fetch user playlists & favorites if they have active sessions (via AuthProvider axios token)
		fetchPlaylists();
		fetchFavorites();
	}, [fetchPlaylists, fetchFavorites]);

	const handleCreatePlaylist = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		const playlist = await createPlaylist(name, description, imageUrl);
		if (playlist) {
			setIsCreateOpen(false);
			setName("");
			setDescription("");
			setImageUrl("");
			navigate(`/playlists/${playlist._id}`);
		}
	};

	const isLoading = isMusicLoading || isPlaylistLoading;

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}

			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800 relative",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
							{unreadUsers.size > 0 && (
								<span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
							)}
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4 flex flex-col overflow-hidden'>
				<div className='flex items-center justify-between mb-4 flex-shrink-0'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline font-bold'>Your Library</span>
					</div>
					<SignedIn>
						<Button
							variant="ghost"
							size="icon"
							className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8"
							onClick={() => setIsCreateOpen(true)}
							title="Create Playlist"
						>
							<Plus className="size-5" />
						</Button>
					</SignedIn>
				</div>

				<ScrollArea className='flex-1 pr-2'>
					<div className='space-y-2'>
						{/* Liked Songs Entry */}
						<SignedIn>
							<Link
								to="/liked-songs"
								className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
							>
								<div className="size-12 rounded-md bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
									<Heart className="size-5 text-white fill-white group-hover:scale-110 transition-transform" />
								</div>
								<div className="flex-1 min-w-0 hidden md:block">
									<p className="font-semibold text-white truncate">Liked Songs</p>
									<p className="text-sm text-zinc-400 truncate">
										Playlist • {favorites.length} songs
									</p>
								</div>
							</Link>
						</SignedIn>

						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							<>
								{/* Custom Playlists */}
								{playlists.map((playlist) => (
									<Link
										to={`/playlists/${playlist._id}`}
										key={playlist._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<img
											src={playlist.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop"}
											alt='Playlist img'
											className='size-12 rounded-md flex-shrink-0 object-cover border border-white/5 shadow-md'
										/>

										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium text-white truncate'>{playlist.name}</p>
											<p className='text-sm text-zinc-400 truncate'>
												Playlist • {playlist.songs?.length || 0} songs
											</p>
										</div>
									</Link>
								))}

								{/* Official Albums */}
								{albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<img
											src={album.imageUrl}
											alt='Album img'
											className='size-12 rounded-md flex-shrink-0 object-cover border border-white/5 shadow-md'
										/>

										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium text-white truncate'>{album.title}</p>
											<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
										</div>
									</Link>
								))}
							</>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* Dialog to create Playlist */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
					<form onSubmit={handleCreatePlaylist}>
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">Create New Playlist</DialogTitle>
							<DialogDescription className="text-zinc-400 text-sm">
								Create a personalized space for your favorite tracks.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 my-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Name *</label>
								<Input
									type="text"
									placeholder="My Awesome Playlist"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Description (Optional)</label>
								<Input
									type="text"
									placeholder="Add an optional description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Cover Image URL (Optional)</label>
								<Input
									type="url"
									placeholder="https://example.com/playlist-cover.jpg"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsCreateOpen(false)}
								className="text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-green-500 hover:bg-green-400 text-black font-semibold"
							>
								Create
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};
export default LeftSidebar;

