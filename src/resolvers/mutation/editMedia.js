import { getUserFromToken, validateToken } from '../utils/utils.js';

function updateMediaById(db, id, updatedMedia) {
    return db('Media').where('id', id).update(updatedMedia);
}

const editMedia = async (_, { input }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, token);
    const user = await model.User.getUserFromToken(db, token);

    const { id, title, description, url, mimetype, thumbnail, adminOnly } = input;

    const media = await db('Media').where('id', id).first();
    if (!media) {
        throw new Error('Media not found');
    }

    const updatedMedia = {
        ...(title && { title }),
        ...(description && { description }),
        ...(url && { url }),
        ...(mimetype && { mimetype_id: (await db('Mimetype').select('id').where('type', mimetype).first()).id }),
        ...(thumbnail && { thumbnail }),
        updated: db.fn.now()  // Set the updated column to the current timestamp
    };

    if (user.admin && adminOnly !== undefined) {
        updatedMedia.adminOnly = adminOnly;
    }

    await updateMediaById(db, id, updatedMedia);

    return model.Media.getMediaById(db, id);
};

export default editMedia;
