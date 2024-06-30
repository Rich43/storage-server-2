export const createMediaComment = async (_, { input }, { db, model, utils, token }) => {
    await utils.validateToken(db, token);
    const user = await utils.getUserFromToken(db, token);

    const { mediaId, comment } = input;

    const newComment = {
        media_id: mediaId,
        user_id: user.id,
        comment,
        created: db.fn.now(),
        updated: db.fn.now()
    };

    const [insertedComment] = await model.MediaComment.insertMediaComment(db, newComment);

    return insertedComment;
};

export default createMediaComment;
