const listMedia = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    // Validate the token to ensure the user is authenticated
    await model.Session.validateToken(db, utils, token);

    // Get the current user from the token
    const user = await model.User.getUserFromToken(db, token);

    // Build the media query without a category filter
    let mediaQuery = model.Media.getMediaQuery(db, user);

    // Apply filtering
    mediaQuery = utils.performFilter(filter, mediaQuery);

    // Apply pagination
    mediaQuery = utils.performPagination(pagination, mediaQuery);

    // Apply sorting
    mediaQuery = utils.performSorting(sorting, mediaQuery);

    // Execute the query and return results
    return mediaQuery.select('*'); // Ensure the query executes and returns results
};

export default listMedia;
