export function getLikesByMediaId(db, mediaId) {
    return db('Media_Likes_Dislikes')
        .where('mediaId', mediaId)
        .where('action', 'LIKE');
}

export function getDislikesByMediaId(db, mediaId) {
    return db('Media_Likes_Dislikes')
        .where('mediaId', mediaId)
        .where('action', 'DISLIKE');
}

export function getLikesByUserId(db, userId) {
    return db('Media_Likes_Dislikes')
        .where('userId', userId)
        .where('action', 'LIKE');
}

export function getDislikesByUserId(db, userId) {
    return db('Media_Likes_Dislikes')
        .where('userId', userId)
        .where('action', 'DISLIKE');
}

export async function createLikeDislike(db, input) {
    const result = await db('media_likes_dislikes').insert(input);
    const id = result[0]; // MySQL returns the inserted ID as the first element of the result array
    return db('media_likes_dislikes').where({ id }).first();
}

export async function updateLikeDislike(db, id, input) {
    await db('media_likes_dislikes').where({ id }).update(input);
    return db('media_likes_dislikes').where({ id }).first();
}

export async function deleteLikeDislike(db, id) {
    const likeDislike = await db('media_likes_dislikes').where({ id }).first();
    await db('media_likes_dislikes').where({ id }).delete();
    return likeDislike;
}

export function getLikeCountByMediaId(db, mediaId) {
    return db('media_likes_dislikes')
        .where('mediaId', mediaId)
        .where('action', 'LIKE')
        .count();
}

export function getDislikeCountByMediaId(db, mediaId) {
    return db('media_likes_dislikes')
        .where('mediaId', mediaId)
        .where('action', 'DISLIKE')
        .count();
}

export function getAnyLikeDislikeById(db, id) {
    return db('media_likes_dislikes').where({ id }).first();
}
