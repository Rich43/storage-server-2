import { getUserFromToken, validateToken } from '../utils.js';

const deleteMediaComment = async (_, { id }, { db, token }) => {
    await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const existingComment = await db('MediaComment').where('id', id).first();
    if (!existingComment) {
        throw new Error('Comment not found');
    }

    if (existingComment.user_id !== user.id && !user.admin) {
        throw new Error('Not authorized to delete this comment');
    }

    await db('MediaComment').where('id', id).del();

    return true;
};

export default deleteMediaComment;
