const setAvatar = async (parent, { mediaId }, { db, model, utils, token }) => {
    try {
        // Verify the user is authenticated
        const session = await model.Session.validateToken(db, token);
        if (!token) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Not authenticated');
        }

        // Check if the media has an image mime type category
        const media = await model.Media.getFirstMediaItemWithImageMimetypeById(db, mediaId);

        if (!media) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Media must have image mime type category');
        }

        // Update the user's avatar
        await model.User.updateUserAvatar(db, session.userId, mediaId);

        // noinspection UnnecessaryLocalVariableJS
        const updatedUser = model.User.getUserById(session.userId);

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to set avatar');
    }
};

export default setAvatar;
