const createMedia = async (_, { input }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    const user = await model.User.getUserFromToken(db, token);

    const { adminOnly } = input;

    // Only admins can set adminOnly to true
    const mediaAdminOnly = !!(user.admin && adminOnly);
    const mimetype = await model.Mimetype.getMimetypeIdByType(db, input.mimetype);
    const [mediaId] = await model.Media.insertMedia(db, user, mediaAdminOnly, input, mimetype);

    return model.Media.getMediaById(db, mediaId);
};

export default createMedia;
