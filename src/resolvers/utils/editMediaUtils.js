export const validateSessionAndUser = async (db, model, utils, token) => {
    await model.Session.validateToken(db, utils, token);
    return await model.User.getUserFromToken(db, token);
};

export const getMimetypeId = async (db, model, mimetype) => {
    const mimetypeFunc = await model.Mimetype.getMimetypeIdByType(db, mimetype);
    return mimetypeFunc.id;
};

export const buildUpdatedMedia = (input, mimetypeId, updated, user) => {
    const { title, description, url, thumbnail, adminOnly } = input;
    const updatedMedia = {
        updated,
        ...(title && { title }),
        ...(description && { description }),
        ...(url && { url }),
        ...(mimetypeId && { mimetype_id: mimetypeId }),
        ...(thumbnail && { thumbnail }),
    };

    if (user.admin && adminOnly !== undefined) {
        updatedMedia.adminOnly = adminOnly;
    }

    return updatedMedia;
};
