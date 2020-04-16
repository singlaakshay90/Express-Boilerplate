const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../../../config');
const fileUploadService = {};
AWS.config.update({ accessKeyId: CONFIG.s3Bucket.accessKeyId, secretAccessKey: CONFIG.s3Bucket.secretAccessKey });
let s3Bucket = new AWS.S3();
const { AVAILABLE_EXTENSIONS_FOR_FILE_UPLOADS, SERVER, MESSAGES, ERROR_TYPES } = require(`../../utils/constants`);
const HELPERS = require("../../helpers");

/**
 * function to upload a file to s3(AWS) bucket.
 */
fileUploadService.uploadFileToS3 = (payload, fileName, bucketName) => {
    return new Promise((resolve, reject) => {
        s3Bucket.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: payload.file.buffer,
            ACL: 'public-read',
        }, function (err, data) {
            if (err) {
                console.log('Error here', err);
                return reject(err);
            }
            resolve(data.Location);
        });
    });
};

/**
 * function to upload file to local server.
 */
fileUploadService.uploadFileToLocal = async (payload, fileName, pathToUpload, pathOnServer) => {
    let directoryPath = pathToUpload ? pathToUpload : path.resolve(__dirname + `../../../..${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}/${payload.user._id}`);
    // create user's directory if not present.
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    let fileSavePath = `${directoryPath}/${fileName}`;
    let writeStream = fs.createWriteStream(fileSavePath);
    return new Promise((resolve, reject) => {
        writeStream.write(payload.file.buffer);
        writeStream.on('error', function (err) {
            reject(err);
        });
        writeStream.end(function (err) {
            if (err) {
                reject(err);
            } else {
                let fileUrl = pathToUpload ? `${CONFIG.SERVER_URL}${pathOnServer}/${fileName}` : `${CONFIG.SERVER_URL}${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}/${payload.user._id}/${fileName}`;
                resolve(fileUrl);
            }
        });
    });
};

/**
 * function to upload a file on either local server or on s3 bucket.
 */
fileUploadService.uploadFile = async (file, pathToUpload, pathOnServer) => {
    let fileName = file.originalname.toString();

    let fileExtension = fileName.substr(fileName.lastIndexOf('.'));
    if (AVAILABLE_EXTENSIONS_FOR_FILE_UPLOADS.indexOf(fileExtention) !== -(SERVER.ONE)) {
        let fileName = `upload_${Date.now()}_${Math.floor(Math.random() * 10)}${fileExtension}`, fileUrl = '';
        let UPLOAD_TO_S3 = process.env.UPLOAD_TO_S3 ? process.env.UPLOAD_TO_S3 : '';
        if (UPLOAD_TO_S3.toLowerCase() === 'true') {
            let s3BucketName = CONFIG.s3Bucket.bucketName;
            fileUrl = await fileUploadService.uploadFileToS3(file, fileName, s3BucketName);
        } else {
            let pathToUpload = path.resolve(__dirname + `../../../..${CONFIG.PATH_TO_UPLOAD_FILES_ON_LOCAL}`),
                pathOnServer = CONFIG.PATH_TO_UPLOAD_FILES_ON_LOCAL;
            fileUrl = await fileUploadService.uploadFileToLocal(file, fileName, pathToUpload, pathOnServer);
        }
        return { url: fileUrl, type: file.mimetype };;
    }
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_FILE_TYPE, ERROR_TYPES.BAD_REQUEST);
};


module.exports = fileUploadService;