const listMediaComments = async (_, { mediaId }, { db }) => {
    return db('MediaComment').where('media_id', mediaId);
};

export default listMediaComments;
