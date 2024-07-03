const refreshSession = async (_, __, { db, model, utils, token }) => {
    const session = await model.Session.validateToken(db, utils, token);
    const newSessionToken = utils.uuidv4(); // Generate a new unique token
    const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = utils.getDates();
    await model.Session.updateSessionWithNewTokenAndExpiryDate(db, utils, token, newSessionToken, sessionExpireDateTimeFormatted);
    const user = await model.User.getUserById(db, session.userId);
    return {
        userId: user.id,
        sessionId: session.id,
        username: user.username,
        avatarPicture: user.avatar,
        sessionToken: newSessionToken,
        sessionExpireDateTime: sessionExpireDateTime, // Return as ISO string in UTC
        admin: user.admin, // Use the admin field from the User table
    };
};

export default refreshSession;
