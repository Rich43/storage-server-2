// noinspection UnnecessaryLocalVariableJS,ExceptionCaughtLocallyJS

import natural from 'natural';
import { removeStopwords } from 'stopword';

const listRelatedMedia = async (parent, { id }, { knex }) => {
    try {
        // Get the media item by ID
        const media = await knex('Media').where('id', id).first();

        if (!media) {
            throw new Error('Media not found');
        }

        // Extract keywords from the title and description
        const text = `${media.title} ${media.description}`;
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(text.toLowerCase());
        const keywords = removeStopwords(tokens);

        // Create a series of OR clauses to search for related media
        const query = knex('Media').where('id', '!=', id);
        keywords.forEach(keyword => {
            query.orWhere('title', 'like', `%${keyword}%`)
                .orWhere('description', 'like', `%${keyword}%`);
        });

        // Execute the query and return the results
        const relatedMedia = await query;
        return relatedMedia;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to list related media');
    }
};

export default listRelatedMedia;
