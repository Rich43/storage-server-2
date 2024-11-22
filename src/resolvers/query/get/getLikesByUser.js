const getLikesByUser = async (_, __, { db, model, utils, token }) => {
    const session = await model.Session.validateToken(db, utils, token);
    return model.MediaLikesDislikes.getLikesByUserId(db, session.userId);
};

export default getLikesByUser;
