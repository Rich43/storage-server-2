import { getUserFromToken, validateToken } from '../utils.js';



const deleteMedia = async (_, { id }, { db, model, utils, token }) => {
    const session = await validateToken(db, token);
    const user = await getUserFromToken(db, token);

    const media = model.Media.getMediaById(db, id);
    if (!media) {
        throw new Error('Media not found');
    }

    if (media.userId !== session.userId) {
        throw new Error('You can only delete your own media');
    }

    if (media.adminOnly && !user.admin) {
        throw new Error('Only admins can delete adminOnly media');
    }

    await model.Media.deleteMediaById(db, id);
    return true;
};

export default deleteMedia;
