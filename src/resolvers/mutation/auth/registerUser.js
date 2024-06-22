import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from "../../utils.js";

const registerUser = async (parent, { input }, { knex }) => {
    const { username, email, password } = input;

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Check if this is the first user
    const userCount = await knex('User').count('id as count');
    const isFirstUser = userCount[0].count === 0;

    // Create the user in the database
    const newUser = {
        username,
        password: hashedPassword,
        admin: isFirstUser,  // first user is admin
        created: knex.fn.now(),
        avatar: null,
        activated: isFirstUser,  // first user is activated
        activation_key: uuidv4(),
        banned: false,
        updated: knex.fn.now()
    };

    const [insertedUser] = await knex('User').insert(newUser).returning('*');

    return insertedUser;
};

export default registerUser;
