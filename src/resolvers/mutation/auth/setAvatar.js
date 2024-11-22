const setAvatar = async (parent, { mediaId }, { db, model, utils, token }) => {
    try {
        // Verify the user is authenticated
        const session = await model.Session.validateToken(db, utils, token);
        if (!session) {
            throw new Error('Invalid session token');
        }

        // Check if the media has an image mime type category
        const media = await model.Media.getFirstMediaItemWithImageMimetypeById(db, mediaId);

        if (!media) {
            throw new Error('Media must have image mime type category');
        }

        // Update the user's avatar
        await model.User.updateUserAvatar(db, utils, session.userId, mediaId);

        const updatedUser = await model.User.getUserById(db, session.userId);

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the original error for specific error handling in tests
    }
};

export default setAvatar;
