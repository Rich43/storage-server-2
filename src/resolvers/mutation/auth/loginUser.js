const loginUser = async (_, { username, password }, { db, model, utils, token }) => {

    // Hash the password before querying
    const hashedPassword = utils.hashPassword(password);

    // Find and validate the user
    const user = await model.User.validateUser(db, username, hashedPassword);
    if (!user) {
        throw new Error('Invalid username or password');
    }

    // Generate session token and expiry date
    const sessionToken = utils.uuidv4(); // Generate a unique session token
    const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = utils.getDates();

    // Create new session
    const sessionId = await model.Session.createSession(db, utils, user.id, sessionToken, sessionExpireDateTimeFormatted);

    // Retrieve the full session object
    const session = await model.Session.getSessionById(db, sessionId);

    return {
        userId: user.id,
        sessionId: session.id,
        username: user.username,
        avatarPicture: user.avatar,
        sessionToken: session.sessionToken,
        sessionExpireDateTime: sessionExpireDateTime, // Return as ISO string in UTC
        admin: user.admin, // Use the admin field from the User table
    };
};

export default loginUser;
