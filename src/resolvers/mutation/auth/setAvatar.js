// noinspection UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS

import { CustomError } from "../../utils/CustomError.js";

const setAvatar = async (parent, { mediaId }, { db, model, utils, token }) => {
    try {
        // Verify the user is authenticated
        const session = await model.Session.validateToken(db, token);
        if (!session) {
            throw new Error('Not authenticated');
        }

        // Check if the media has an image mime type category
        const media = await model.Media.getFirstMediaItemWithImageMimetypeById(db, mediaId);

        if (!media) {
            throw new Error('Media must have image mime type category');
        }

        // Update the user's avatar
        await model.User.updateUserAvatar(db, session.userId, mediaId);

        const updatedUser = await model.User.getUserById(db, session.userId);

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new CustomError('Failed to set avatar', error);
    }
};

export default setAvatar;
