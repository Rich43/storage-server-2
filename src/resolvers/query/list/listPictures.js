const listPictures = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    await model.User.validateToken(db, token);
    const user = await model.Session.getUserFromToken(db, token);
    let mediaQuery = model.Media.getMediaQuery(db, user, 'IMAGE');
    mediaQuery = utils.performFilter(filter, mediaQuery);
    mediaQuery = utils.performPagination(pagination, mediaQuery);
    mediaQuery = utils.performSorting(sorting, mediaQuery);

    return mediaQuery;
};

export default listPictures;
