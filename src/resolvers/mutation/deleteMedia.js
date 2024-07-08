// noinspection ExceptionCaughtLocallyJS

const deleteMedia = async (_, { id }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    const user = await model.User.getUserFromToken(db, token);

    const media = await model.Media.getMediaById(db, id);
    if (!media) {
        throw new Error('Media not found');
    }

    if (media.userId !== user.id && !user.admin) {
        throw new Error('You can only delete your own media');
    }

    if (media.adminOnly && !user.admin) {
        throw new Error('Only admins can delete adminOnly media');
    }

    await model.Media.deleteMediaById(db, id);
    return true;
};

export default deleteMedia;
