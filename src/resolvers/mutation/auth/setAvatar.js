const setAvatar = async (parent, { mediaId }, { knex, user }) => {
    try {
        // Verify the user is authenticated
        if (!user) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Not authenticated');
        }

        // Check if the media has an image mime type category
        const media = await knex('Media')
            .join('Mimetype', 'Media.mimetype_id', 'Mimetype.id')
            .where('Media.id', mediaId)
            .andWhere('Mimetype.category', 'IMAGE')
            .first();

        if (!media) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Media must have image mime type category');
        }

        // Update the user's avatar
        await knex('User')
            .where('id', user.id)
            .update({
                avatar: mediaId,
                updated: knex.fn.now()
            });

        // noinspection UnnecessaryLocalVariableJS
        const updatedUser = await knex('User')
            .where('id', user.id)
            .first();

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to set avatar');
    }
};

export default setAvatar;
