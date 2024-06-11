import { validateToken } from '../utils.js';

const listAlbums = async (_, __, { db, token }) => {
    await validateToken(db, token);
// Join Session with User to get the admin flag
    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    const albums = await db('Album').select('*');

    let albumMediaQuery = db('Album_Media')
        .join('Media', 'Album_Media.mediaId', '=', 'Media.id')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .select('Album_Media.albumId', 'Media.*', 'Mimetype.type as mimetype');

    if (!userSession.admin) {
        albumMediaQuery = albumMediaQuery.where('Media.adminOnly', false);
    }

    const albumMedia = await albumMediaQuery;

    return albums.map(album => ({
        ...album,
        media: albumMedia.filter(am => am.albumId === album.id)
    }));
};

export default listAlbums;
