export async function insertMediaComment(db, newComment) {
    await db('MediaComment').insert(newComment);
    return await db('MediaComment').where(newComment).first();
}

export async function getMediaCommentById(db, id) {
    return await db('MediaComment').where('id', id).first();
}

export function deleteMediaCommentById(db, id) {
    return db('MediaComment').where('id', id).del();
}

export function updateMediaCommentById(db, id, updatedComment) {
    return db('MediaComment').where('id', id).update(updatedComment);
}

export function getMediaCommentsByMediaId(db, mediaId) {
    return db('MediaComment').where('mediaId', mediaId);
}
