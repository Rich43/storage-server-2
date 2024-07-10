import listAlbums from './query/list/listAlbums.js';
import listMusic from './query/list/listMusic.js';
import listPictures from './query/list/listPictures.js';
import listVideos from './query/list/listVideos.js';
import listDocuments from './query/list/listDocuments.js';
import listOtherFiles from './query/list/listOtherFiles.js';
import getMediaById from './query/getMediaById.js';
import loginUser from './mutation/auth/loginUser.js';
import logoutUser from './mutation/auth/logoutUser.js';
import refreshSession from './mutation/auth/refreshSession.js';
import createMedia from './mutation/createMedia.js';
import editMedia from './mutation/editMedia.js';
import deleteMedia from './mutation/deleteMedia.js';
import registerUser from "./mutation/auth/registerUser.js";
import activateUser from "./mutation/auth/activateUser.js";
import setAvatar from "./mutation/auth/setAvatar.js";
import listRelatedMedia from "./query/list/listRelatedMedia.js";
import listMediaComments from "./query/list/listMediaComments.js";
import createMediaComment from "./mutation/createMediaComment.js";
import editMediaComment from "./mutation/editMediaComment.js";
import deleteMediaComment from "./mutation/deleteMediaComment.js";
import getDislikesByUser from "./query/get/getDislikesByUser.js";
import getLikesByUser from "./query/get/getLikesByUser.js";
import createLikeDislike from "./mutation/create/createLikeDislike.js";
import deleteLikeDislike from "./mutation/delete/deleteLikeDislike.js";
import updateLikeDislike from "./mutation/update/updateLikeDislike.js";

const resolvers = {
    Query: {
        listVideos,
        listMusic,
        listAlbums,
        listPictures,
        listDocuments,
        listOtherFiles,
        getMediaById,
        getDislikesByUser,
        getLikesByUser,
        listRelatedMedia,
        listMediaComments,
    },
    Mutation: {
        createMedia,
        editMedia,
        deleteMedia,
        loginUser,
        logoutUser,
        refreshSession,
        registerUser,
        activateUser,
        setAvatar,
        createMediaComment,
        editMediaComment,
        deleteMediaComment,
        createLikeDislike,
        deleteLikeDislike,
        updateLikeDislike,
    },
    Media: {
        likes: async (parent, args, { db, model }) => {
            if (parent.id && db && model) {
                return model.MediaLikesDislikes.getLikeCountByMediaId(db, parent.id);
            } else {
                return 0;
            }
        },
        dislikes: async (parent, args, { db, model }) => {
            if (parent.id && db && model) {
                return model.MediaLikesDislikes.getDislikeCountByMediaId(db, parent.id);
            } else {
                return 0;
            }
        }
    }
};

export default resolvers;
