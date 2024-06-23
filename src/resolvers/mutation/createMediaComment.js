import { getUserFromToken, validateToken } from '../utils.js';

const createMediaComment = async (_, { input }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const { mediaId, comment } = input;

    const newComment = {
        media_id: mediaId,
        user_id: user.id,
        comment,
        created: db.fn.now(),
        updated: db.fn.now()
    };

    const [insertedComment] = await db('MediaComment').insert(newComment).returning('*');

    return insertedComment;
};

export default createMediaComment;
