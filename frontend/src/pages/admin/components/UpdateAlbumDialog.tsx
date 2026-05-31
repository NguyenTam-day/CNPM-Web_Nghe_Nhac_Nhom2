import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";
import { Album } from "@/types";
import { Pencil, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UpdateAlbumDialogProps {
	album: Album;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const UpdateAlbumDialog = ({ album, open, onOpenChange }: UpdateAlbumDialogProps) => {
	const { updateAlbum, isLoading } = useMusicStore();

	const [form, setForm] = useState({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Pre-fill with current album values
	useEffect(() => {
		if (open && album) {
			setForm({
				title: album.title || "",
				artist: album.artist || "",
				releaseYear: album.releaseYear || new Date().getFullYear(),
			});
			setImageFile(null);
		}
	}, [open, album]);

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("title", form.title);
		formData.append("artist", form.artist);
		formData.append("releaseYear", String(form.releaseYear));
		if (imageFile) formData.append("imageFile", imageFile);

		await updateAlbum(album._id, formData);
		if (!isLoading) {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Pencil className="h-5 w-5 text-violet-500" />
						Edit Album
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Update information for <span className="text-white font-medium">"{album.title}"</span>. Leave artwork unchanged to keep current cover.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 py-4">
					{/* Hidden file input */}
					<input
						type="file"
						ref={fileInputRef}
						onChange={(e) => setImageFile(e.target.files?.[0] || null)}
						accept="image/*"
						className="hidden"
					/>

					{/* Album artwork preview + replace */}
					<div className="flex gap-4 items-center">
						<div
							className="relative group w-24 h-24 rounded-md overflow-hidden border-2 border-dashed border-zinc-700 cursor-pointer flex-shrink-0"
							onClick={() => fileInputRef.current?.click()}
						>
							<img
								src={imageFile ? URL.createObjectURL(imageFile) : album.imageUrl}
								alt={album.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Upload className="h-5 w-5 text-white" />
								<span className="text-[10px] text-white mt-1">Replace</span>
							</div>
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium text-zinc-200">Cover Artwork</p>
							<p className="text-xs text-zinc-500 mt-1">Click the image to upload a new cover.</p>
							{imageFile && (
								<span className="text-xs text-violet-400 font-medium mt-1 block truncate">
									✓ {imageFile.name}
								</span>
							)}
						</div>
					</div>

					{/* Album title */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Album Title</label>
						<Input
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
							placeholder="Enter album title"
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-violet-500"
						/>
					</div>

					{/* Artist */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Artist</label>
						<Input
							value={form.artist}
							onChange={(e) => setForm({ ...form, artist: e.target.value })}
							placeholder="Enter artist name"
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-violet-500"
						/>
					</div>

					{/* Release Year */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Release Year</label>
						<Input
							type="number"
							value={form.releaseYear}
							onChange={(e) => setForm({ ...form, releaseYear: parseInt(e.target.value) || new Date().getFullYear() })}
							min={1900}
							max={new Date().getFullYear()}
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-violet-500"
						/>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !form.title || !form.artist}
						className="bg-violet-500 hover:bg-violet-600 text-white font-semibold"
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateAlbumDialog;
