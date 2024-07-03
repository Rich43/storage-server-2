// noinspection UnnecessaryLocalVariableJS

export const createMediaComment = async (_, { input }, { db, model, utils, token }) => {
    await utils.validateToken(db, token);
    const user = await utils.getUserFromToken(db, token);

    const { mediaId, comment } = input;

    const newComment = {
        mediaId: mediaId,
        userId: user.id,
        comment,
        created: utils.moment().utc().toISOString(),
        updated: utils.moment().utc().toISOString()
    };

    const insertedComment = await model.MediaComment.insertMediaComment(db, newComment);

    return insertedComment;
};

export default createMediaComment;
