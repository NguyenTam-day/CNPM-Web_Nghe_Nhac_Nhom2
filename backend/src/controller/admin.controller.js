import {
	createSongService,
	deleteSongService,
	createAlbumService,
	deleteAlbumService,
	updateSongService,
	updateAlbumService,
} from "../service/admin.service.js";

export const createSong = async (req, res, next) => {
	try {
		console.log("🎵 createSong called - req.auth:", req.auth);
		console.log(
			"🎵 Files received:",
			req.files ? Object.keys(req.files) : "none"
		);
		console.log("🎵 Body:", req.body);

		const song = await createSongService(req.body, req.files);

		res.status(201).json(song);
	} catch (error) {
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		await deleteSongService(req.params.id);

		res.status(200).json({
			message: "Song deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const updateSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await updateSongService(id, req.body, req.files);
		res.status(200).json(song);
	} catch (error) {
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const album = await createAlbumService(
			req.body,
			req.files
		);

		res.status(201).json(album);
	} catch (error) {
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		await deleteAlbumService(req.params.id);

		res.status(200).json({
			message: "Album deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const updateAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		const album = await updateAlbumService(id, req.body, req.files);
		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};

export const checkAdmin = async (req, res) => {
	res.status(200).json({
		admin: true,
	});
};