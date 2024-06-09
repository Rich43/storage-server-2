import { validateToken } from './utils.js';

const listAlbums = async (_, __, { db, token }) => {
    await validateToken(db, token);
    return db('Album').select('*');
};

export default listAlbums;
