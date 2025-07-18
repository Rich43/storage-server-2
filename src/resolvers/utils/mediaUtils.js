// noinspection UnnecessaryLocalVariableJS

import natural from 'natural';
import { removeStopwords } from 'stopword';

export function extractKeywords(text) {
    if (!text) return [];
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const filtered = removeStopwords(tokens);
    const stemmed = filtered.map((t) => natural.PorterStemmer.stem(t));
    return Array.from(new Set(stemmed));
}

export function getMediaKeywords(media) {
    const text = `${media.title || ''} ${media.description || ''}`.trim();
    return extractKeywords(text);
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
        if (filter.search) {
            const keywords = extractKeywords(filter.search);
            keywords.forEach((keyword) => {
                mediaQuery = mediaQuery.where((builder) =>
                    builder
                        .orWhere('Media.title', 'like', `%${keyword}%`)
                        .orWhere('Media.description', 'like', `%${keyword}%`),
                );
            });
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
