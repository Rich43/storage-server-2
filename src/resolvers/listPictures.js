import { validateToken } from './utils.js';

const listPictures = async (_, __, { db, token }) => {
    await validateToken(db, token);
    return db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'IMAGE')
        .select('Media.*', 'Mimetype.type as mimetype');
};

export default listPictures;
