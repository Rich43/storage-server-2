import { validateToken } from '../../utils.js';

const listAlbums = async (_, { filter, pagination, sorting }, { db, token }) => {
    await validateToken(db, token);

    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    let albumQuery = db('Album')
        .select('*');

    if (filter) {
        if (filter.title) {
            albumQuery = albumQuery.where('Album.title', 'like', `%${filter.title}%`);
        }
        if (filter.userId) {
            albumQuery = albumQuery.where('Album.userId', filter.userId);
        }
    }

    if (pagination) {
        const { page, limit } = pagination;
        albumQuery = albumQuery.limit(limit).offset((page - 1) * limit);
    }

    if (sorting) {
        const { field, order } = sorting;
        albumQuery = albumQuery.orderBy(field, order);
    }

    const albums = await albumQuery;

    for (const album of albums) {
        let mediaQuery = db('Media')
            .join('Album_Media', 'Media.id', '=', 'Album_Media.mediaId')
            .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
            .where('Album_Media.albumId', album.id)
            .select('Media.*', 'Mimetype.type as mimetype');

        if (!userSession.admin) {
            mediaQuery = mediaQuery.where('Media.adminOnly', false);
        }

        album.media = await mediaQuery;
    }

    return albums;
};

export default listAlbums;
