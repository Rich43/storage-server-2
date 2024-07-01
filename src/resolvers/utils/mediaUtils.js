// noinspection UnnecessaryLocalVariableJS

import natural from "natural";
import { removeStopwords } from "stopword";

export function getMediaKeywords(media) {
    const text = `${media.title} ${media.description}`;
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const keywords = removeStopwords(tokens);
    return keywords;
}

export function performFilter(filter, mediaQuery) {
    if (filter) {
        if (filter.title) {
            mediaQuery = mediaQuery.where('Media.title', 'like', `%${filter.title}%`);
        }
        if (filter.mimetype) {
            mediaQuery = mediaQuery.where('Mimetype.type', filter.mimetype);
        }
        if (filter.userId) {
            mediaQuery = mediaQuery.where('Media.userId', filter.userId);
        }
    }
    return mediaQuery;
}

export function performPagination(pagination, mediaQuery) {
    if (pagination) {
        const {page, limit} = pagination;
        mediaQuery = mediaQuery.limit(limit).offset((page - 1) * limit);
    }
    return mediaQuery;
}

export function performSorting(sorting, mediaQuery) {
    if (sorting) {
        const {field, order} = sorting;
        mediaQuery = mediaQuery.orderBy(field, order);
    }
    return mediaQuery;
}
