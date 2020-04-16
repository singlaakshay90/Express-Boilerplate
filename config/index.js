const path = require("path");
const lodash = require("lodash");

var development = require("./env/development");
var production = require("./env/production");
var staging = require("./env/staging");

var PLATFORM = process.env.PLATFORM || "boilerplate";
var mongoUri = "mongodb://localhost:27017/boilerplate";

var defaults = {
    PLATFORM: PLATFORM,
    root: path.normalize(__dirname + "/../app"),
    theme: PLATFORM + "/us",
    mongoUri: mongoUri,
    adminEmail: "asif.techie@gmail.com",
    host: "sdudomain.com",
    SENDGRID_API_KEY: "CHANGEME",
    environment: process.env.NODE_ENV || "production",
    show: function () {
        console.log("environment: " + this.environment);
    },
    SENDINBLUE: {
        API_KEY: "dummy",
        SENDER_EMAIL: "contact@demo.in"
    },
    SMTP: {
        TRANSPORT: {
            host: "webcloud5.uk.syrahost.com",
            port: 465,
            secure: true,
            auth: {
                user: "erpadmin@demo.co.in",
                pass: ")Q}UQvb^cFU$"
            }
        },
        SENDER: "ERP Admin <erpadmin@demo.co.in>"
    },
    FCM: {
        API_KEY: "AIzaSyCUeSXr7v6CXuu4vKlzliK_VHqA4ytyX7E"
    },
    ENV_STAGING: "staging",
    ENV_DEVELOPMENT: "development",
    ENV_PRODUCTION: "production",
    environment: process.env.NODE_ENV || "development",
    mongoDB: {
        PROTOCOL: process.env.DB_PROTOCOL || "mongodb",
        HOST: process.env.DB_HOST || "127.0.0.1",
        PORT: process.env.DB_PORT || 27017,
        NAME: PLATFORM || "portalui",
        USER: "",
        PASSWORD: "",
        get URL() {
            return (
                process.env.dbUrl ||
                `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.NAME}`
            );
        }
    },
    domain: {
        PROTOCOL: process.env.DOMAIN_PROTOCOL || "http",
        HOST: process.env.DOMAIN_HOST || "127.0.0.1",
        PORT: process.env.DOMAIN_PORT ? process.env.DOMAIN_PORT : "3000",
        get URL() {
            return `${this.PROTOCOL}://${this.HOST}${
                !!this.PORT ? ":" + this.PORT : ""
                }`;
        }
    },
    server: {
        PROTOCOL: process.env.SERVER_PROTOCOL || "http",
        HOST: process.env.SERVER_HOST || "0.0.0.0",
        PORT: process.env.SERVER_PORT || "3000",
        get URL() {
            return `${this.PROTOCOL}://${this.HOST}:${this.PORT}`;
        }
    },
    UI_PATHS: {
        BASE_PATH: "http://192.168.2.120:3000",
        CHALLENGE_SCREEN_PATH: "/challenges"
    },
    PATH_TO_UPLOAD_ZIP_FILES_ON_LOCAL:
        process.env.PATH_TO_UPLOAD_ZIP_FILES_ON_LOCAL ||
        "/uploads/challengeZips",
    swagger: require("./swagger"),
    SWAGGER_PATH: '/documentation',
    PATH_TO_UPLOADS_ON_LOCAL: '/uploads',
    PATH_TO_UPLOAD_FILES_ON_LOCAL: process.env.PATH_TO_UPLOAD_FILES_ON_LOCAL || '/uploads/files',
    s3Bucket: {
        accessKeyId: process.env.ACCESS_KEY_ID || 'access-key-id',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || 'secret-access-key',
        bucketName: process.env.S3_BUCKET_NAME || "bucket-name",
        submissionBucketName: `${process.env.S3_BUCKET_NAME}/submissions` || 'submissions-path',
        normalFilesPath: `${process.env.S3_BUCKET_NAME}/files` || 'normal-files-path',
    },
};

let currentEnvironment = process.env.NODE_ENV || "production";

function myConfig(myConfig) {
    let mergedConfig = lodash.extend(lodash.clone(defaults), myConfig);
    return mergedConfig;
}

module.exports = {
    development: myConfig(development),
    production: myConfig(production),
    staging: myConfig(staging)
}[currentEnvironment];
