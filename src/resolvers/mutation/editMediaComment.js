import { getUserFromToken, validateToken } from '../utils.js';

const editMediaComment = async (_, { input }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const { id, comment } = input;

    const existingComment = await db('MediaComment').where('id', id).first();
    if (!existingComment) {
        throw new Error('Comment not found');
    }

    if (existingComment.user_id !== user.id) {
        throw new Error('Not authorized to edit this comment');
    }

    const updatedComment = {
        comment,
        updated: db.fn.now()
    };

    await db('MediaComment').where('id', id).update(updatedComment);

    return db('MediaComment').where('id', id).first();
};

export default editMediaComment;
