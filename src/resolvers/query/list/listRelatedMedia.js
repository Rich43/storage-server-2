// noinspection UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS

import { CustomError } from '../../utils/CustomError';

const listRelatedMedia = async (parent, { id }, { db, model, utils, token }) => {
    try {
        // Get the media item by ID
        const media = await model.Media.getMediaById(db, id);

        if (!media) {
            throw new CustomError('Media not found', null);
        }

        const keywords = utils.getMediaKeywords(media);
        const query = model.Media.addRelatedKeywords(db, id, keywords);

        // Execute the query and return the results
        const relatedMedia = await query;
        return relatedMedia;
    } catch (error) {
        console.error(error);
        throw new CustomError('Failed to list related media', error);
    }
};

export default listRelatedMedia;
