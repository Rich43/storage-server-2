import { validateToken } from '../utils.js';

const listMusic = async (_, __, { db, token }) => {
    await validateToken(db, token);
// Join Session with User to get the admin flag
    const userSession = await db('Session')
        .join('User', 'Session.userId', 'User.id')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    let mediaQuery = db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', 'AUDIO')
        .select('Media.*', 'Mimetype.type as mimetype');

    if (!userSession.admin) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }

    return mediaQuery;
};

export default listMusic;
