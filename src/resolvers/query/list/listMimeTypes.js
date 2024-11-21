const listMimeTypes = async (_, { filter, pagination, sorting }, { db, model, utils, token }) => {
    // Validate token
    await model.Session.validateToken(db, utils, token);

    // Retrieve the user associated with the token
    await model.User.getUserFromToken(db, token);

    // Start the MIME types query
    let mimeTypeQuery = db('mimetype');

    // Apply filtering
    mimeTypeQuery = utils.performFilter(filter, mimeTypeQuery);

    // Apply pagination
    mimeTypeQuery = utils.performPagination(pagination, mimeTypeQuery);

    // Apply sorting
    mimeTypeQuery = utils.performSorting(sorting, mimeTypeQuery);

    // Execute and return the query results
    return mimeTypeQuery.select('*');
};

export default listMimeTypes;
