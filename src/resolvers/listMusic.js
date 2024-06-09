import { validateToken } from './utils.js';

const listMusic = async (_, __, { db, token }) => {
    await validateToken(db, token);
    return db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'AUDIO')
        .select('Media.*');
};

export default listMusic;
