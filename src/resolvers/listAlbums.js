import { validateToken } from './utils.js';

const listAlbums = async (_, __, { db, token }) => {
    await validateToken(db, token);

    const albums = await db('Album').select('*');

    const albumMedia = await db('Album_Media')
        .join('Media', 'Album_Media.mediaId', '=', 'Media.id')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .select('Album_Media.albumId', 'Media.*', 'Mimetype.type as mimetype');

    return albums.map(album => ({
        ...album,
        media: albumMedia.filter(am => am.albumId === album.id)
    }));
};

export default listAlbums;
