export async function getMimetypeIdByType(db, mimetype) {
    return await db('Mimetype').select('id').where('type', mimetype).first();
}
