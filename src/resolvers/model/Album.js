export function getAllAlbums(db) {
    return db('Album')
        .select('*');
}

export function filterAlbum(filter, albumQuery) {
    if (filter) {
        if (filter.title) {
            albumQuery = albumQuery.where('Album.title', 'like', `%${filter.title}%`);
        }
        if (filter.userId) {
            albumQuery = albumQuery.where('Album.userId', filter.userId);
        }
    }
    return albumQuery;
}
