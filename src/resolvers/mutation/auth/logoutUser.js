const logoutUser = async (_, __, { db, model, token }) => {
    // Delete the session by token
    await model.Session.deleteSession(db, token);
    return true;
};

export default logoutUser;
