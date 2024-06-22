import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const registerUser = async (parent, { input }, { knex }) => {
    const { username, email, password } = input;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
    };

    await knex('User').insert(newUser);

    return newUser;
};

export default registerUser;