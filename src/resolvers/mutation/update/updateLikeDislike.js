const updateLikeDislike = async (_, { input }, { db, model, utils, token }) => {
    const session = await model.Session.validateToken(db, utils, token);
    const { id, action } = input;

    // Fetch the record to check ownership
    const likeDislike = await model.MediaLikesDislikes.getAnyLikeDislikeById(db, id);
    if (!likeDislike) {
        throw new Error('Record not found');
    }

    // Check if the user owns the record
    if (likeDislike.userId !== session.userId) {
        throw new Error('You are not authorized to update this record');
    }

    return model.MediaLikesDislikes.updateLikeDislike(db, id, { action });
};

export default updateLikeDislike;
