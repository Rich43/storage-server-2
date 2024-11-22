const listMediaComments = async (_, { mediaId }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    return model.MediaComment.getMediaCommentsByMediaId(db, mediaId);
};

export default listMediaComments;
