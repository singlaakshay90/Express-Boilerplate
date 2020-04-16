"use strict";

const CONFIG = require("../../../config");
const HELPERS = require("../../helpers");
const { MESSAGES, ERROR_TYPES } = require("../../utils/constants");
const { userService } = require("../../services");
const _ = require('lodash');

/**************************************************
 **** Auth controller for authentication logic ****
 **************************************************/
let userController = {};

/**
 * function to get server response.
 */
userController.getServerResponse = async payload => {
    return HELPERS.responseHelper.createSuccessResponse(
        MESSAGES.SERVER_IS_WORKING_FINE
    );
};

/**
 * function to register a user to the system.
 */
userController.registerNewUser = async payload => {
    let newRegisteredUser = _.omit(await (await userService.registerUser(payload)).toObject() || {}, ['password', '__v', 'updatedAt', 'createdAt']);
    return Object.assign(
        HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_REGISTERED_SUCCESSFULLY), { user: newRegisteredUser }
    );
};

/**
 * function to login a user to the system.
 **/
userController.loginUser = async payload => {
    // TODO authenticate user from API.
    let isAuthenticated = await authService.validateToken(
        payload.token
    );
    if (isAuthenticated) {
        // create/update user's details in database.
        await SERVICES.userService.createAndUpdateUser(payload);

        // create/update user's session.
        await SERVICES.sessionService.createAndUpdateSession(payload);
        return Object.assign(
            HELPERS.responseHelper.createSuccessResponse(
                MESSAGES.LOGGED_IN_SUCCESSFULLY
            ),
            {
                redirectUrl: `${CONFIG.UI_PATHS.BASE_PATH}${CONFIG.UI_PATHS.CHALLENGE_SCREEN_PATH}?userToken=${payload.token}`
            }
        );
    }
    throw HELPERS.responseHelper.createErrorResponse(
        MESSAGES.UNAUTHORIZED,
        ERROR_TYPES.UNAUTHORIZED
    );
};


/**
 * function to get users 
 */
userController.getUsers = async payload => {
    let criteria;
    let users = await userService.getUsers(criteria);
    return Object.assign(
        HELPERS.responseHelper.createSuccessResponse(MESSAGES.USERS_FETCHED_SUCCESSFULLY), { users }
    );
};

/**
 * function to  get user by its id
 */
userController.getUserById = async payload => {
    let user = await userService.getUserById(payload);
    return Object.assign(
        HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_FETCHED_SUCCESSFULLY), { user }
    );
};

/**
 * function to upload a file to local server or to s3 bucket.
 */
userController.uploadFile = async (payload) => {
    let fileUrl = await fileUploadService.uploadFile(payload.files[0]);
    return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.FILE_UPLOADED_SUCCESSFULLY), { fileUrl });
};

/**
 * function to upload multiple to s3 bucket.
 */
userController.uploadMultipleFiles = async (payload) => {
    let files = payload.files, attachments = [];
    let fileCount = files.length;
    if (!fileCount) throw HELPERS.responseHelper.createErrorResponse(MESSAGES.FILE_IS_REQUIRED, ERROR_TYPES.BAD_REQUEST);
    for (let file = 0; file < files.length; file++) {
        attachments.push(await fileUploadService.uploadFile(files[file]));
    }
    return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.FILES_UPLOADED_SUCCESSFULLY), { attachments });
};
/* export userController */
module.exports = userController;
