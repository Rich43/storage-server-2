// noinspection UnnecessaryLocalVariableJS

import natural from 'natural';
import { removeStopwords } from 'stopword';

export function getMediaKeywords(media) {
    const text = `${media.title || ''} ${media.description || ''}`.trim();
    if (!text) return [];
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const keywords = removeStopwords(tokens);
    return keywords;
}

export function performFilter(filter, mediaQuery) {
    if (filter) {
        if (filter.title) {
            mediaQuery = mediaQuery.where(
                'Media.title',
                'like',
                `%${filter.title}%`,
            );
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
    if (pagination && Object.keys(pagination).length > 0) {
        const { page, limit } = pagination;
        if (page !== undefined && limit !== undefined) {
            mediaQuery = mediaQuery.limit(limit).offset((page - 1) * limit);
        }
    }
    return mediaQuery;
}

export function performSorting(sorting, mediaQuery) {
    if (sorting && Object.keys(sorting).length > 0) {
        const { field, order } = sorting;
        if (field && order) {
            mediaQuery = mediaQuery.orderBy(field, order);
        }
    }
    return mediaQuery;
}
