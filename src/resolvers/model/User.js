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

export async function updateActivationKey(db, userId) {
    await db('User')
        .where('id', userId)
        .update({
            activated: true,
            activation_key: null,
            updated: db.fn.now()
        });
}

export async function getUserById(db, userId) {
    return await db('User').where({id: userId}).first();
}

export async function getUserCount(db) {
    return await db('User').count('id as count');
}

export async function createNewUser(db, newUser) {
    return await db('User').insert(newUser).returning('*');
}

export async function updateUserAvatar(db, userId, mediaId) {
    await db('User')
        .where('id', userId)
        .update({
            avatar: mediaId,
            updated: db.fn.now()
        });
}
