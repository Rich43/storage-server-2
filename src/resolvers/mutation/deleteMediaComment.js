// noinspection JSUnusedLocalSymbols

const deleteMediaComment = async (_, { id }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, token);
    const user = await model.User.getUserFromToken(db, token);

    const existingComment = await model.MediaComment.getMediaCommentById(db, id);
    if (!existingComment) {
        throw new Error('Comment not found');
    }

    if (existingComment.user_id !== user.id && !user.admin) {
        throw new Error('Not authorized to delete this comment');
    }

    await model.MediaComment.deleteMediaCommentById(db, id);

    return true;
};

export default deleteMediaComment;
