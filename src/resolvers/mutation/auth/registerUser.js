const registerUser = async (parent, { input }, { db, model, utils, token }) => {
    const { username, email, password } = input;

    // Hash the password
    const hashedPassword = utils.hashPassword(password);

    // Check if this is the first user
    const userCount = await model.User.getUserCount(db);
    const isFirstUser = userCount[0].count === 0;

    // Create the user in the database
    const newUser = {
        username,
        password: hashedPassword,
        admin: isFirstUser,  // first user is admin
        created: db.fn.now(),
        avatar: null,
        activated: isFirstUser,  // first user is activated
        activation_key: utils.uuidv4(),
        banned: false,
        updated: db.fn.now()
    };

    const [insertedUser] = await model.User.createNewUser(db, newUser);

    return insertedUser;
};

export default registerUser;
