// noinspection JSUnusedLocalSymbols

const editMediaComment = async (_, { input }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, token);
    const user = await model.User.getUserFromToken(db, token);

    const { id, comment } = input;

    const existingComment = await model.MediaComment.getMediaCommentById(db, id);
    if (!existingComment) {
        throw new Error('Comment not found');
    }

    if (existingComment.user_id !== user.id) {
        throw new Error('Not authorized to edit this comment');
    }

    const updatedComment = {
        comment,
        updated: utils.moment().utc().toISOString()
    };

    await model.MediaComment.updateMediaCommentById(db, id, updatedComment);

    return model.MediaComment.getMediaCommentById(db, id);
};

export default editMediaComment;
