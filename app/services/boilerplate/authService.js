const { SECURITY, MESSAGES, ERROR_TYPES } = require("../../utils/constants");
const CONFIG = require("../../../config");
const HELPERS = require("../../helpers");
const sessionModel = require(`../../models/${CONFIG.PLATFORM}/sessionModel`);

let authService = {};

/**
 * function to authenticate user.
 */
authService.userValidate = () => {
    return (request, response, next) => {
        validateUser(request)
            .then(isAuthorized => {
                if (isAuthorized) {
                    return next();
                }
                let responseObject = HELPERS.responseHelper.createErrorResponse(
                    MESSAGES.UNAUTHORIZED,
                    ERROR_TYPES.UNAUTHORIZED
                );
                return response
                    .status(responseObject.statusCode)
                    .json(responseObject);
            })
            .catch(err => {
                let responseObject = HELPERS.responseHelper.createErrorResponse(
                    MESSAGES.UNAUTHORIZED,
                    ERROR_TYPES.UNAUTHORIZED
                );
                return response
                    .status(responseObject.statusCode)
                    .json(responseObject);
            });
    };
};

/**
 * function to validate user's jwt token and fetch its details from the system.
 * @param {} request
 **/
let validateUser = async request => {
    try {
        // return request.headers.authorization === SECURITY.STATIC_TOKEN_FOR_AUTHORIZATION
        let authenticatedUser = await sessionModel
            .findOne({ userToken: request.headers.authorization })
            .lean();
        if (authenticatedUser) {
            request.user = authenticatedUser;
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

/**
 * function to validate user's token from samsung server if it is valid or not.
 */
authService.validateToken = async token => {
    // TODO call samsung server to validate if user's token is valid or not.
    let isValidToken = true;
    return isValidToken;
};

module.exports = authService;
