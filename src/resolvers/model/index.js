import {
    createNewUser,
    findActivationKey,
    getUserById,
    getUserCount,
    getUserFromToken,
    updateActivationKey,
    updateUserAvatar,
    validateUser
} from "./User.js";
import {
    createSession,
    deleteSession, getAdminFlagFromSession,
    getSessionById,
    updateSessionWithNewTokenAndExpiryDate,
    validateToken
} from "./Session.js";
import {
    deleteMediaById,
    getFirstMediaItemWithImageMimetypeById,
    getMediaById,
    getMediaByIdJoiningOntoMimeType, getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype,
    getMediaQuery,
    insertMedia,
    addAdminOnlyRestriction, addRelatedKeywords,
} from "./Media.js";
import {
    dbListMediaComments,
    deleteMediaCommentById,
    getMediaCommentById,
    insertMediaComment,
    updateMediaCommentById
} from "./MediaComment.js";
import { filterAlbum, getAllAlbums } from "./Album.js";

export default {
    User: {
        validateUser,
        getUserFromToken,
        findActivationKey,
        updateActivationKey,
        getUserById,
        getUserCount,
        createNewUser,
        updateUserAvatar,
    },
    Session: {
        validateToken,
        createSession,
        getSessionById,
        deleteSession,
        updateSessionWithNewTokenAndExpiryDate,
        getAdminFlagFromSession,
    },
    Media: {
        getMediaQuery,
        getFirstMediaItemWithImageMimetypeById,
        insertMedia,
        getMediaById,
        deleteMediaById,
        getMediaByIdJoiningOntoMimeType,
        getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype,
        addAdminOnlyRestriction,
        addRelatedKeywords,
    },
    MediaComment: {
        insertMediaComment,
        getMediaCommentById,
        deleteMediaCommentById,
        updateMediaCommentById,
        dbListMediaComments,
    },
    Album: {
        getAllAlbums,
        filterAlbum,
    }
};
