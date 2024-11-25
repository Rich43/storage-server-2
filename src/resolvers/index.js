import listAlbums from './query/list/listAlbums.js';
import listMusic from './query/list/listMusic.js';
import listPictures from './query/list/listPictures.js';
import listVideos from './query/list/listVideos.js';
import listDocuments from './query/list/listDocuments.js';
import listOtherFiles from './query/list/listOtherFiles.js';
import getMediaById from './query/get/getMediaById.js';
import loginUser from './mutation/auth/loginUser.js';
import logoutUser from './mutation/auth/logoutUser.js';
import refreshSession from './mutation/auth/refreshSession.js';
import createMedia from './mutation/create/createMedia.js';
import editMedia from './mutation/update/editMedia.js';
import deleteMedia from './mutation/delete/deleteMedia.js';
import registerUser from './mutation/auth/registerUser.js';
import activateUser from './mutation/auth/activateUser.js';
import setAvatar from './mutation/auth/setAvatar.js';
import listRelatedMedia from './query/list/listRelatedMedia.js';
import listMediaComments from './query/list/listMediaComments.js';
import getDislikesByUser from './query/get/getDislikesByUser.js';
import getLikesByUser from './query/get/getLikesByUser.js';
import createLikeDislike from './mutation/create/createLikeDislike.js';
import deleteLikeDislike from './mutation/delete/deleteLikeDislike.js';
import updateLikeDislike from './mutation/update/updateLikeDislike.js';
import listMimeTypes from './query/list/listMimeTypes.js';
import editUser from './mutation/auth/editUser.js';
import listMedia from './query/list/listMedia.js';

const resolvers = {
    Query: {
        lists: {
            listAlbums,
            listDocuments,
            listMedia,
            listMediaComments,
            listMimeTypes,
            listMusic,
            listOtherFiles,
            listPictures,
            listRelatedMedia,
            listVideos,
        },
        gets: {
            getMediaById,
            getLikesByUser,
            getDislikesByUser,
        },
    },
    Mutation: {
        media: {
            createMedia,
            editMedia,
            deleteMedia,
        },
        auth: {
            activateUser,
            editUser,
            loginUser,
            logoutUser,
            refreshSession,
            registerUser,
            setAvatar,
        },
        likes: {
            createLikeDislike,
            updateLikeDislike,
            deleteLikeDislike,
        },
    },
    Media: {
        likes: async (parent, args, { db, model }) => {
            if (parent && parent.id && db && model) {
                return model.MediaLikesDislikes.getLikeCountByMediaId(
                    db,
                    parent.id,
                );
            } else {
                return 0;
            }
        },
        dislikes: async (parent, args, { db, model }) => {
            if (parent && parent.id && db && model) {
                return model.MediaLikesDislikes.getDislikeCountByMediaId(
                    db,
                    parent.id,
                );
            } else {
                return 0;
            }
        },
    },
};

export default resolvers;
