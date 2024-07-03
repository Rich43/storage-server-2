// noinspection ExceptionCaughtLocallyJS

import { CustomError } from '../utils/CustomError';

const deleteMedia = async (_, { id }, { db, model, utils, token }) => {
    try {
        const session = await model.Session.validateToken(db, utils, token);
        const user = await model.User.getUserFromToken(db, token);

        const media = await model.Media.getMediaById(db, id);
        if (!media) {
            throw new CustomError('Media not found');
        }

        if (media.userId !== session.userId) {
            throw new CustomError('You can only delete your own media');
        }

        if (media.adminOnly && !user.admin) {
            throw new CustomError('Only admins can delete adminOnly media');
        }

        await model.Media.deleteMediaById(db, id);
        return true;
    } catch (error) {
        console.error(error);
        throw new CustomError('Failed to delete media', error);
    }
};

export default deleteMedia;
