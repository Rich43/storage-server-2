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

const resolvers = {
    Query: {
        listVideos,
        listMusic,
        listAlbums,
        listPictures,
        listDocuments,
        listOtherFiles,
        getMediaById,
    },
    Mutation: {
        loginUser,
        logoutUser,
        refreshSession,
        createMedia,
        editMedia,
        deleteMedia,
    }
};

export default resolvers;
