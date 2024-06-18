import { getUserFromToken, validateToken } from '../utils.js';

const getMediaById = async (_, { id }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const media = await db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .select('Media.*', 'Mimetype.type as mimetype')
        .where('Media.id', id)
        .first();

    if (!media) {
        throw new Error('Media not found');
    }

    if (media.adminOnly && !user.admin) {
        throw new Error('You do not have permission to view this media');
    }

    return media;
};

export default getMediaById;
