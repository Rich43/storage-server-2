// noinspection UnnecessaryLocalVariableJS

export const createMediaComment = async (
    _,
    { input },
    { db, model, utils, token },
) => {
    await model.Session.validateToken(db, utils, token);
    const user = await model.User.getUserFromToken(db, token);

    const { mediaId, comment } = input;

    const newComment = {
        mediaId: mediaId,
        userId: user.id,
        comment,
        created: utils.moment().utc().toISOString(),
        updated: utils.moment().utc().toISOString(),
    };

    const insertedComment = await model.MediaComment.insertMediaComment(
        db,
        newComment,
    );

    return insertedComment;
};

export default createMediaComment;
