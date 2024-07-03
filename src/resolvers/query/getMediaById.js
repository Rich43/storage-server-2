const getMediaById = async (_, { id }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    const user = await model.User.getUserFromToken(db, token);

    const media = await model.Media.getMediaByIdJoiningOntoMimeType(db, id);

    if (!media) {
        throw new Error('Media not found');
    }

    if (media.adminOnly && !user.admin) {
        throw new Error('You do not have permission to view this media');
    }

    return media;
};

export default getMediaById;
