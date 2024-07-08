// noinspection UnnecessaryLocalVariableJS

export async function insertMediaComment(db, newComment) {
    const id = await db('MediaComment').insert(newComment);
    let result = await db('MediaComment').where('id', id[0]).first();
    return result;
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
