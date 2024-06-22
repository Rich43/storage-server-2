const logoutUser = async (_, __, { db, token }) => {
    // Delete the session by token
    await db('Session').where({ sessionToken: token }).del();
    return true;
};

export default logoutUser;
