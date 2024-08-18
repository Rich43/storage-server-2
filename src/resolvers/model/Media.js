// noinspection UnnecessaryLocalVariableJS

import moment from "moment";

export function getMediaQuery(db, user, category) {
    let mediaQuery = db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Mimetype.category', category)
        .select('Media.*', 'Mimetype.type as mimetype');

    if (!user.admin) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }
    return mediaQuery;
}

export async function getFirstMediaItemWithImageMimetypeById(db, mediaId) {
    const media = await db('Media')
        .join('Mimetype', 'Media.mimetypeId', 'Mimetype.id')
        .where('Media.id', mediaId)
        .andWhere('Mimetype.category', 'IMAGE')
        .first();
    return media;
}

export async function insertMedia(db, user, mediaAdminOnly, input, mimetypeId) {
    const mediaData = {
        title: input.title,
        description: input.description,
        url: input.url,
        mimetypeId,
        thumbnail: input.thumbnail,
        userId: user.userId,
        adminOnly: mediaAdminOnly,
        filename: input.filename,
        filesize: input.filesize,
        uploaded: input.uploaded,
        uploadedDate: input.uploadedDate,
        user_extension: input.user_extension,
        view_count: 0,
        created: moment().utc().toISOString(),
        updated: moment().utc().toISOString()
    };

    await db('Media').insert(mediaData);

    const insertedMedia = await db('Media')
        .where(mediaData)
        .first();

    return [insertedMedia.id];
}

export function getMediaById(db, mediaId) {
    return db('Media').where('id', mediaId).first();
}

export async function getMediaByIdJoiningOntoMimeType(db, id) {
    return await db('Media')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .select('Media.*', 'Mimetype.type as mimetype')
        .where('Media.id', id)
        .first();
}

export function getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype(db, albumId) {
    return db('Media')
        .join('Album_Media', 'Media.id', '=', 'Album_Media.mediaId')
        .join('Mimetype', 'Media.mimetypeId', '=', 'Mimetype.id')
        .where('Album_Media.albumId', albumId)
        .select('Media.*', 'Mimetype.type as mimetype');
}

export function deleteMediaById(db, id) {
    return db('Media').where('id', id).del();
}

export function addAdminOnlyRestriction(adminFlag, mediaQuery) {
    if (!adminFlag) {
        mediaQuery = mediaQuery.where('Media.adminOnly', false);
    }
    return mediaQuery;
}

export function addRelatedKeywords(db, id, keywords) {
    const query = db('Media').where('id', '!=', id);
    keywords.forEach(keyword => {
        query.orWhere('title', 'like', `%${keyword}%`)
            .orWhere('description', 'like', `%${keyword}%`);
    });
    return query;
}

export function updateMediaById(db, id, updatedMedia) {
    return db('Media').where('id', id).update(updatedMedia);
}

export function bumpMediaViewCount(db, id) {
    return db('Media').where('id', id).increment('view_count');
}
