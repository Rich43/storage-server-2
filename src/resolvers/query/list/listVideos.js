const listVideos = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    const session = await model.Session.validateToken(db, token);
    const user = await model.User.getUserFromToken(db, token);
    let mediaQuery = model.Media.getMediaQuery(db, user, 'VIDEO');
    mediaQuery = utils.performFilter(filter, mediaQuery);
    mediaQuery = utils.performPagination(pagination, mediaQuery);
    mediaQuery = utils.performSorting(sorting, mediaQuery);

    return mediaQuery;
};

export default listVideos;
