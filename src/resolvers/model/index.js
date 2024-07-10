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
    deleteSession,
    getAdminFlagFromSession,
    getSessionById,
    updateSessionWithNewTokenAndExpiryDate,
    validateToken
} from "./Session.js";
import {
    addAdminOnlyRestriction,
    addRelatedKeywords,
    bumpMediaViewCount,
    deleteMediaById,
    getFirstMediaItemWithImageMimetypeById,
    getMediaByAlbumIdJoiningOnAlbumMediaAndMimetype,
    getMediaById,
    getMediaByIdJoiningOntoMimeType,
    getMediaQuery,
    insertMedia,
    updateMediaById,
} from "./Media.js";
import {
    deleteMediaCommentById,
    getMediaCommentById,
    getMediaCommentsByMediaId,
    insertMediaComment,
    updateMediaCommentById
} from "./MediaComment.js";
import { filterAlbum, getAllAlbums } from "./Album.js";
import { getMimetypeIdByType } from "./Mimetype.js";
import {
    createLikeDislike,
    deleteLikeDislike,
    getDislikeCountByMediaId,
    getDislikesByMediaId,
    getDislikesByUserId,
    getLikeCountByMediaId,
    getLikesByMediaId,
    getLikesByUserId,
    updateLikeDislike
} from "./MediaLikesDislikes.js";

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
        bumpMediaViewCount,
    },
    MediaComment: {
        insertMediaComment,
        getMediaCommentById,
        deleteMediaCommentById,
        updateMediaCommentById,
        getMediaCommentsByMediaId,
    },
    Album: {
        getAllAlbums,
        filterAlbum,
    },
    Mimetype: {
        getMimetypeIdByType,
    },
    MediaLikesDislikes: {
        getLikesByMediaId,
        getDislikesByMediaId,
        getLikesByUserId,
        getDislikesByUserId,
        createLikeDislike,
        updateLikeDislike,
        deleteLikeDislike,
        getLikeCountByMediaId,
        getDislikeCountByMediaId,
    }
};
