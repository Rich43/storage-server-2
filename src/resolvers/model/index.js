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
    addAdminOnlyRestriction, addRelatedKeywords, updateMediaById,
} from "./Media.js";
import {
    dbListMediaComments,
    deleteMediaCommentById,
    getMediaCommentById,
    insertMediaComment,
    updateMediaCommentById
} from "./MediaComment.js";
import { filterAlbum, getAllAlbums } from "./Album.js";
import { getMimetypeIdByType } from "./Mimetype.js";

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
        updateMediaById,
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
    },
    Mimetype: {
        getMimetypeIdByType,
    }
};
