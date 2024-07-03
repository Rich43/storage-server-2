const editMedia = async (_, { input }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, token);
    const user = await model.User.getUserFromToken(db, token);

    const { id, title, description, url, mimetype, thumbnail, adminOnly } = input;

    const media = await model.Media.getMediaById(db, id);
    if (!media) {
        throw new Error('Media not found');
    }

    const mimetypeFunc = await model.Mimetype.getMimetypeIdByType(db, mimetype);
    const updatedMedia = {
        ...(title && { title }),
        ...(description && { description }),
        ...(url && { url }),
        ...(mimetype && { mimetype_id: mimetypeFunc.id }),
        ...(thumbnail && { thumbnail }),
        updated: utils.moment().utc().toISOString()  // Set the updated column to the current timestamp
    };

    if (user.admin && adminOnly !== undefined) {
        updatedMedia.adminOnly = adminOnly;
    }

    await model.Media.updateMediaById(db, id, updatedMedia);

    return model.Media.getMediaById(db, id);
};

export default editMedia;
