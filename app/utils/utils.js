let CONSTANTS = require("./constants");
const MONGOOSE = require("mongoose");
const BCRYPT = require("bcrypt");
const JWT = require("jsonwebtoken");
const CONFIG = require("../../config");
const transporter = require("nodemailer").createTransport(
    CONFIG.SMTP.TRANSPORT
);
const handlebars = require("handlebars");
let commonFunctions = {};

/**
 * incrypt password in case user login implementation
 * @param {*} payloadString
 */
commonFunctions.hashPassword = payloadString => {
    return BCRYPT.hashSync(payloadString, CONSTANTS.SECURITY.BCRYPT_SALT);
};

/**
 * @param {string} plainText
 * @param {string} hash
 */
commonFunctions.compareHash = (payloadPassword, userPassword) => {
    return BCRYPT.compareSync(payloadPassword, userPassword);
};

/**
 * function to get array of key-values by using key name of the object.
 */
commonFunctions.getEnumArray = obj => {
    return Object.keys(obj).map(key => obj[key]);
};

/** used for converting string id to mongoose object id */
commonFunctions.convertIdToMongooseId = stringId => {
    return MONGOOSE.Types.ObjectId(stringId);
};

/** create jsonwebtoken **/
commonFunctions.encryptJwt = payload => {
    let token = JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, {
        algorithm: "HS256"
    });
    return token;
};

commonFunctions.decryptJwt = token => {
    return JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, {
        algorithm: "HS256"
    });
};

/**
 * function to convert an error into a readable form.
 * @param {} error
 */
commonFunctions.convertErrorIntoReadableForm = error => {
    let errorMessage = "";
    if (error.message.indexOf("[") > -1) {
        errorMessage = error.message.substr(error.message.indexOf("["));
    } else {
        errorMessage = error.message;
    }
    errorMessage = errorMessage.replace(/"/g, "");
    errorMessage = errorMessage.replace("[", "");
    errorMessage = errorMessage.replace("]", "");
    error.message = errorMessage;
    return error;
};

/***************************************
 **** Logger for error and success *****
 ***************************************/
commonFunctions.messageLogs = (error, success) => {
    if (error) console.log(`\x1b[31m` + error);
    else console.log(`\x1b[32m` + success);
};

/**
 * function to get pagination condition for aggregate query.
 * @param {*} sort
 * @param {*} skip
 * @param {*} limit
 */
commonFunctions.getPaginationConditionForAggregate = (sort, skip, limit) => {
    let condition = [
        ...(!!sort ? [{ $sort: sort }] : []),
        { $skip: skip },
        { $limit: limit }
    ];
    return condition;
};

/**
 * function to remove undefined keys from the payload.
 * @param {*} payload
 */
commonFunctions.removeUndefinedKeysFromPayload = (payload = {}) => {
    for (let key in payload) {
        if (!payload[key]) {
            delete payload[key];
        }
    }
};

commonFunctions.sendEmail = async (email, subject, content) => {
    let emailToSend = {
        to: email,
        from: CONFIG.CREDENTIALS.SMTP.SENDER,
        subject: subject,
        html: content
    };
    return await transporter.sendMail(emailToSend);
};

commonFunctions.emailTypes = (user, type, data) => {
    let EmailStatus = {
        Subject: "",
        data: {},
        template: ""
    };
    switch (type) {
        case CONSTANTS.EMAIL_TYPES.WELCOME_VERIFICATION_EMAIL:
            EmailStatus["Subject"] =
                CONSTANTS.EMAIL_SUBJECTS.WELCOME_VERIFICATION_EMAIL;
            EmailStatus.template =
                CONSTANTS.EMAIL_CONTENTS.WELCOME_VERIFICATION_EMAIL;
            EmailStatus.data["fullName"] = user.fullName;
            EmailStatus.data["verifylink"] = data.link;
            break;

        case CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL:
            EmailStatus["Subject"] =
                CONSTANTS.EMAIL_SUBJECTS.FORGOT_PASSWORD_EMAIL;
            EmailStatus.template =
                CONSTANTS.EMAIL_CONTENTS.FORGOT_PASSWORD_EMAIL;
            EmailStatus.data["fullName"] = user.fullName;
            EmailStatus.data["resetPasswordLink"] = data.link;
            break;

        case CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL_UPDATED:
            EmailStatus["Subject"] =
                CONSTANTS.EMAIL_SUBJECTS.FORGOT_PASSWORD_EMAIL;
            EmailStatus.template =
                CONSTANTS.EMAIL_CONTENTS.FORGOT_PASSWORD_EMAIL_UPDATED;
            EmailStatus.data["fullName"] = user.fullName;
            EmailStatus.data["code"] = data.code;
            break;

        default:
            EmailStatus["Subject"] = "Welcome Email!";
            break;
    }
    return EmailStatus;
};

commonFunctions.renderTemplate = (template, data) => {
    return handlebars.compile(template)(data);
};

module.exports = commonFunctions;
