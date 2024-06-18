import { getUserFromToken, validateToken } from '../utils.js';

const createMedia = async (_, { input }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const { title, url, mimetype, thumbnail, adminOnly } = input;

    // Only admins can set adminOnly to true
    const mediaAdminOnly = !!(user.admin && adminOnly);

    const [mediaId] = await db('Media').insert({
        title,
        url,
        mimetypeId: await db('Mimetype').select('id').where('type', mimetype).first(),
        thumbnail,
        userId: user.userId,
        adminOnly: mediaAdminOnly
    }).returning('id');

    return db('Media').where('id', mediaId).first();
};

export default createMedia;
