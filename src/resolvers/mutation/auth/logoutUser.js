const logoutUser = async (_, __, { db, model, utils, token}) => {
    // Delete the session by token
    await model.Session.deleteSession(db, token);
    return true;
};

export default logoutUser;
