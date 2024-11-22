const listAlbums = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    try {
        await model.Session.validateToken(db, utils, token); // this now takes 3 arguments
        const adminFlag = await model.Session.getAdminFlagFromSession(db, token); // this now returns a boolean

        let albumQuery = model.Album.getAllAlbums(db);
        albumQuery = model.Album.filterAlbum(filter, albumQuery);
        albumQuery = utils.performPagination(pagination, albumQuery);
        albumQuery = utils.performSorting(sorting, albumQuery);

        const albums = await albumQuery;

        for (const album of albums) {
            let mediaQuery = model.Media.getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype(db, album);
            mediaQuery = model.Media.addAdminOnlyRestriction(adminFlag, mediaQuery); // modified to accept adminFlag as a boolean
            album.media = await mediaQuery;
        }

        return albums;
    } catch (error) {
        console.error('Error in listAlbums:', error); // Add debug statement
        throw error;
    }
};

export default listAlbums;
