// noinspection UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS

const listRelatedMedia = async (parent, { id }, { db, model, utils, token }) => {
    try {
        // Get the media item by ID
        const media = await model.Media.getMediaById(db, id);

        if (!media) {
            throw new Error('Media not found');
        }

        const keywords = utils.getMediaKeywords(media);
        const query = model.Media.addRelatedKeywords(db, id, keywords);

        // Execute the query and return the results
        const relatedMedia = await query;
        return relatedMedia;
    } catch (error) {
        console.error('Failed to list related media:', error);
        if (error.message === 'Media not found') {
            throw error;
        }
        throw new Error('Failed to list related media');
    }
};

export default listRelatedMedia;
