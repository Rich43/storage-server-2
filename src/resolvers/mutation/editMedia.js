import { getUserFromToken, validateToken } from '../utils.js';

const editMedia = async (_, { input }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const { id, title, url, mimetype, thumbnail, adminOnly } = input;

    const media = await db('Media').where('id', id).first();
    if (!media) {
        throw new Error('Media not found');
    }

    const updatedMedia = {
        ...(title && { title }),
        ...(url && { url }),
        ...(mimetype && { mimetypeId: await db('Mimetype').select('id').where('type', mimetype).first() }),
        ...(thumbnail && { thumbnail }),
    };

    if (user.admin && adminOnly !== undefined) {
        updatedMedia.adminOnly = adminOnly;
    }

    await db('Media').where('id', id).update(updatedMedia);

    return db('Media').where('id', id).first();
};

export default editMedia;
