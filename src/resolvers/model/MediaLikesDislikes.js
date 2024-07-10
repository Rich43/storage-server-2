export function getLikesByMediaId(db, mediaId) {
    return db('Media_Likes_Dislikes')
        .where('mediaId', mediaId)
        .where('like', 'LIKE');
}

export function getDislikeByMediaId(db, mediaId) {
    return db('Media_Likes_Dislikes')
        .where('mediaId', mediaId)
        .where('like', 'DISLIKE');
}