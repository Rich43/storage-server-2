// noinspection UnnecessaryLocalVariableJS

export const validateUser = async (db, username, hashedPassword) => {
    return await db('User').where({ username, password: hashedPassword }).first();
};

export async function getUserFromToken(db, token) {
    const user = await db('User')
        .join('Session', 'User.id', 'Session.userId')
        .select('User.admin')
        .where('Session.sessionToken', token)
        .first();

    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function findActivationKey(db, activationCode) {
    const user = await db('User')
        .where('activation_key', activationCode)
        .first();
    return user;
}

export async function updateActivationKey(db, utils, userId) {
    await db('User')
        .where('id', userId)
        .update({
            activated: true,
            activation_key: '',
            updated: utils.moment().utc().toISOString()
        });
}

export async function getUserById(db, userId) {
    return await db('User').where({id: userId}).first();
}

export async function getUserCount(db) {
    return await db('User').count('id as count');
}

export async function createNewUser(db, utils, newUser) {
    const userData = {
        username: newUser.username,
        password: newUser.password,
        admin: newUser.admin || false,
        avatar: newUser.avatar || null,
        activated: newUser.activated || false,
        activation_key: newUser.activation_key,
        banned: newUser.banned || false,
        created: utils.moment().utc().toISOString(),
        updated: utils.moment().utc().toISOString()
    };

    await db('User').insert(userData);

    const insertedUser = await db('User')
        .where(userData)
        .first();

    return insertedUser;
}

export async function updateUserAvatar(db, utils, userId, mediaId) {
    await db('User')
        .where('id', userId)
        .update({
            avatar: mediaId,
            updated: utils.moment().utc().toISOString()
        });
}

export async function updateUser(db, utils, userId, updateFields) {
    const allowedFields = ['username', 'email', 'password', 'avatar', 'activated', 'banned', 'updated']; // List of allowed fields
    const fieldsToUpdate = {};

    for (const key of Object.keys(updateFields)) {
        if (allowedFields.includes(key)) {
            fieldsToUpdate[key] = updateFields[key];
        }
    }

    // Always update the 'updated' field
    fieldsToUpdate.updated = utils.moment().utc().toISOString();

    if (Object.keys(fieldsToUpdate).length > 0) {
        await db('User')
            .where('id', userId)
            .update(fieldsToUpdate);
    }
}
