// noinspection ExceptionCaughtLocallyJS

const editMedia = async (_, { input }, { db, model, utils, token }) => {
    try {
        // Validate the user session and get the user information
        const user = await utils.validateSessionAndUser(
            db,
            model,
            utils,
            token,
        );
        if (!user) {
            throw new Error('User validation failed');
        }

        // Get the mimetype ID if mimetype is provided
        const mimetypeId = input.mimetype
            ? await utils.getMimetypeId(db, model, input.mimetype)
            : null;

        // Get the current time in UTC format
        const updated = utils.moment().utc().toISOString();

        // Build the updated media object
        const updatedMedia = utils.buildUpdatedMedia(
            input,
            mimetypeId,
            updated,
            user,
        );

        // Update the media record by ID
        await model.Media.updateMediaById(db, input.id, updatedMedia);

        // Retrieve and return the updated media record
        const media = await model.Media.getMediaById(db, input.id);
        if (!media) {
            throw new Error('Media not found after update');
        }

        return media;
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error editing media:', error);
        throw new Error(error.message); // Throw the specific error message
    }
};

export default editMedia;
