import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Error uploading to cloudinary");
    }
};

export const createSongService = async (body, files) => {
    if (!files || !files.audioFile || !files.imageFile) {
        throw new Error("Please upload all files");
    }

    const { title, artist, albumId, duration, lyrics, genres } = body;
    const { audioFile, imageFile } = files;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    let parsedGenres = [];

    if (genres) {
        parsedGenres = genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
    }

    const song = new Song({
        title,
        artist,
        audioUrl,
        imageUrl,
        duration,
        lyrics: lyrics || "",
        genres: parsedGenres,
        albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
        await Album.findByIdAndUpdate(albumId, {
            $push: { songs: song._id },
        });
    }

    return song;
};

export const deleteSongService = async (songId) => {
    const song = await Song.findById(songId);

    if (!song) {
        throw new Error("Song not found");
    }

    if (song.albumId) {
        await Album.findByIdAndUpdate(song.albumId, {
            $pull: { songs: song._id },
        });
    }

    await Song.findByIdAndDelete(songId);
};

export const createAlbumService = async (body, files) => {
    const { title, artist, releaseYear } = body;

    if (!files?.imageFile) {
        throw new Error("Image file is required");
    }

    const imageUrl = await uploadToCloudinary(files.imageFile);

    const album = new Album({
        title,
        artist,
        imageUrl,
        releaseYear,
    });

    await album.save();

    return album;
};

export const deleteAlbumService = async (albumId) => {
    await Song.deleteMany({ albumId });
    await Album.findByIdAndDelete(albumId);
};

export const updateSongService = async (songId, body, files) => {
    const song = await Song.findById(songId);
    if (!song) {
        throw new Error("Song not found");
    }

    const { title, artist, albumId, lyrics, genres } = body;

    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (lyrics !== undefined) song.lyrics = lyrics;

    if (genres) {
        song.genres = genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
    }

    if (files) {
        if (files.audioFile) {
            const audioUrl = await uploadToCloudinary(files.audioFile);
            song.audioUrl = audioUrl;
            if (body.duration) {
                song.duration = body.duration;
            }
        }
        if (files.imageFile) {
            const imageUrl = await uploadToCloudinary(files.imageFile);
            song.imageUrl = imageUrl;
        }
    }

    const oldAlbumId = song.albumId?.toString();
    const newAlbumId = albumId === "null" || !albumId ? null : albumId;

    if (oldAlbumId !== (newAlbumId ? newAlbumId.toString() : undefined)) {
        // remove from old album
        if (oldAlbumId) {
            await Album.findByIdAndUpdate(oldAlbumId, {
                $pull: { songs: song._id },
            });
        }
        // add to new album
        if (newAlbumId) {
            await Album.findByIdAndUpdate(newAlbumId, {
                $push: { songs: song._id },
            });
        }
        song.albumId = newAlbumId;
    }

    await song.save();
    return song;
};

export const updateAlbumService = async (albumId, body, files) => {
    const album = await Album.findById(albumId);
    if (!album) {
        throw new Error("Album not found");
    }

    const { title, artist, releaseYear } = body;

    if (title) album.title = title;
    if (artist) album.artist = artist;
    if (releaseYear) album.releaseYear = releaseYear;

    if (files?.imageFile) {
        const imageUrl = await uploadToCloudinary(files.imageFile);
        album.imageUrl = imageUrl;
    }

    await album.save();
    return album;
};