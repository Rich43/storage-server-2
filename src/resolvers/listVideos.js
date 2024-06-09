import { validateToken } from './utils.js';

const listVideos = async (_, __, { db, token }) => {
    await validateToken(db, token);
    return db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'VIDEO')
        .select('Media.*');
};

export default listVideos;
