const getDislikesByUser = async (_, { id }, { db, model, utils, token }) => {
    const session = await model.Session.validateToken(db, utils, token);
    return model.MediaLikesDislikes.getDislikesByUserId(db, session.userId);
};

export default getDislikesByUser;
