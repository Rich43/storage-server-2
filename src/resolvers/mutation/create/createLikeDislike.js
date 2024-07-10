const createLikeDislike = async (_, { input }, { db, model, utils, token }) => {
    await model.Session.validateToken(db, utils, token);
    return model.MediaLikesDislikes.createLikeDislike(db, input);
};

export default createLikeDislike;
