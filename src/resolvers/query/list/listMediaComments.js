const listMediaComments = async (_, { mediaId }, { db, model, utils, token }) => {
    return model.MediaComment.dbListMediaComments(db, mediaId);
};

export default listMediaComments;
