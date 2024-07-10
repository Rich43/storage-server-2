const editUser = async (parent, { input }, { db, model, utils, token }) => {
    const { id, ...updateFields } = input;

    await model.Session.validateToken(db, utils, token);

    const currentUserFromToken = await model.User.getUserFromToken(token);

    // Ensure the user is allowed to update the specified user
    if (currentUserFromToken.id !== id && !currentUserFromToken.admin) {
        throw new Error('Unauthorized');
    }

    await model.User.updateUser(db, utils, id, updateFields);

    return db('User').where('id', id).first();
};

export default editUser;