import listAlbums from './list/listAlbums.js';
import listMusic from './list/listMusic.js';
import listPictures from './list/listPictures.js';
import listVideos from './list/listVideos.js';
import listDocuments from './list/listDocuments.js';
import listOtherFiles from './list/listOtherFiles.js';
import getMediaById from './list/getMediaById.js';
import login from './auth/login.js';
import logout from './auth/logout.js';
import refreshSession from './auth/refreshSession.js';
import createMedia from './mutation/createMedia.js';
import editMedia from './mutation/editMedia.js';
import deleteMedia from './mutation/deleteMedia.js';

const resolvers = {
    Query: {
        login,
        logout,
        refreshSession,
        listVideos,
        listMusic,
        listAlbums,
        listPictures,
        listDocuments,
        listOtherFiles,
        getMediaById,
    },
    Mutation: {
        createMedia,
        editMedia,
        deleteMedia,
    }
};

export default resolvers;
