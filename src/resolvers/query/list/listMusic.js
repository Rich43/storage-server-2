const listMusic = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    const user = await model.User.getUserFromToken(db, token);
    let mediaQuery = model.Media.getMediaQuery(db, user, 'AUDIO');
    mediaQuery = utils.performFilter(filter, mediaQuery);
    mediaQuery = utils.performPagination(pagination, mediaQuery);
    mediaQuery = utils.performSorting(sorting, mediaQuery);

    return mediaQuery;
};

export default listMusic;
