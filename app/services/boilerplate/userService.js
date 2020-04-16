"use strict";
const CONFIG = require("../../../config");
const userModel = require(`../../models/boilerplate/userModel`);
const { MESSAGES, ERROR_TYPES, AVAILABLE_EXT_FOR_UPLOAD, SERVER} = require("../../utils/constants");
const fileUploadService = require('./fileUploadService');

const HELPERS = require("../../helpers");


let userService = {};

/**
 * function to register a new  user
 */
userService.registerUser = async payload => {
    let emailExists = await userModel.findOne({ email: payload.email });
    if (emailExists) throw HELPERS.responseHelper.createErrorResponse(MESSAGES.EMAIL_ALREADY_EXISTS, ERROR_TYPES.BAD_REQUEST);
    let user = new userModel(payload);
    return await user.save();
};

/**
 * function to create a new user if not exists in the system and if it exists then update its information.
 */
userService.createAndUpdateUser = async payload => {
    payload.updatedAt = Date.now();
    return await userModel.findOneAndUpdate({ _id: payload.id }, payload, {
        new: true,
        upsert: true
    }).lean();
};

/**
 * function to get all the users with pagination and filters 
 */
userService.getUsers = async (criteria, projection) => {
    projection = { 'password': 0, '__v': 0, 'updatedAt': 0, 'createdAt': 0 };
    return await userModel.find(criteria, projection);
};

/**
 * function to register a new  user
 */
userService.getUserById = async payload => {
    let projection = { 'password': 0, '__v': 0, 'updatedAt': 0, 'createdAt': 0 };
    return await userModel.findById(payload.id, projection).lean();
};

/**
 * function to update a user
 */
userService.updateUserById = async payload => {
    return await userModel(payload).save();
};


/**
 * function to delete user
 */
userService.deleteUser = async payload => {
    return await userModel(payload).save();
};

/**
 * function to upload a file on s3/local server. 
 */
userService.uploadFile = async (payload) => {
    let fileExtention = payload.file.originalname.split('.')[1];
    if (AVAILABLE_EXT_FOR_UPLOAD.indexOf(fileExtention) !== -(SERVER.ONE)) {
        // let fileName = `${challengeId}.zip`;
        //todo add filename function 
        if (process.env.UPLOAD_TO_S3) {
            let s3BucketName = CONFIG.s3Bucket.zipBucketName;
            return await fileUploadService.uploadFileToS3(payload, fileName, s3BucketName);
        } else {
            return await fileUploadService.uploadFileToLocal(payload, fileName);
        }
    }
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_FILE_TYPE, ERROR_TYPES.BAD_REQUEST);

};
module.exports = userService;
