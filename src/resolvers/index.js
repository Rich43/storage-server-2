import listAlbums from './listAlbums.js';
import listMusic from './listMusic.js';
import listPictures from './listPictures.js';
import listVideos from './listVideos.js';
import listDocuments from './listDocuments.js';
import listOtherFiles from './listOtherFiles.js';
import login from './login.js';
import logout from './logout.js';
import refreshSession from './refreshSession.js';
import createMedia from './createMedia.js';

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
    },
    Mutation: {
        createMedia
    }
};

export default resolvers;
