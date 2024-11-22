const registerUser = async (parent, { input }, { db, model, utils }) => {
    const { username, password } = input;

    // Hash the password
    const hashedPassword = utils.hashPassword(password);

    // Check if this is the first user
    const userCount = await model.User.getUserCount(db);
    const isFirstUser = userCount[0].count === 0;

    // Create the user in the database
    const newUser = {
        username,
        password: hashedPassword,
        admin: isFirstUser, // first user is admin
        created: utils.moment().utc().toISOString(),
        avatar: null,
        activated: isFirstUser, // first user is activated
        activation_key: utils.uuidv4(),
        banned: false,
        updated: utils.moment().utc().toISOString(),
    };

    const [insertedUser] = await model.User.createNewUser(db, utils, newUser);

    return insertedUser;
};

export default registerUser;
