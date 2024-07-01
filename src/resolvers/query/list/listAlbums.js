const listAlbums = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, token);
    const userSession = await model.Session.getAdminFlagFromSession(db, token);

    let albumQuery = model.Album.getAllAlbums(db);
    albumQuery = model.Album.filterAlbum(filter, albumQuery);
    albumQuery = utils.performPagination(pagination, albumQuery);
    albumQuery = utils.performSorting(sorting, albumQuery);

    const albums = await albumQuery;

    for (const album of albums) {
        let mediaQuery = model.Media.getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype(db, album);
        mediaQuery = model.Media.addAdminOnlyRestriction(userSession, mediaQuery);
        album.media = await mediaQuery;
    }

    return albums;
};

export default listAlbums;
