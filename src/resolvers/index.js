import listAlbums from './query/list/listAlbums.js';
import listMusic from './query/list/listMusic.js';
import listPictures from './query/list/listPictures.js';
import listVideos from './query/list/listVideos.js';
import listDocuments from './query/list/listDocuments.js';
import listOtherFiles from './query/list/listOtherFiles.js';
import getMediaById from './query/list/getMediaById.js';
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

const resolvers = {
    Query: {
        listVideos,
        listMusic,
        listAlbums,
        listPictures,
        listDocuments,
        listOtherFiles,
        getMediaById,
        listRelatedMedia,
        listMediaComments,  // Add the new listMediaComments query
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
        createMediaComment,  // Add the new createMediaComment mutation
        editMediaComment,  // Add the new editMediaComment mutation
        deleteMediaComment,  // Add the new deleteMediaComment mutation
    }
};

export default resolvers;
