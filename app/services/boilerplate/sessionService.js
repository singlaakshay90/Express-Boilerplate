const CONFIG = require("../../../config");
const sessionModel = require(`../../models/${CONFIG.PLATFORM}/sessionModel`);

let sessionService = {};

/**
 * function to create a new session if not exists and update if it exists in the database.
 */
sessionService.createAndUpdateSession = async payload => {
    return await sessionModel
        .findOneAndUpdate(
            { userId: payload.id, token: payload.token },
            payload,
            { new: true, upsert: true }
        )
        .lean();
};

/**
 * function to verify a user's session.
 */
sessionService.verifySession = async (userId, userToken) => {
    let userSession = await sessionModel.findOne({ userId, userToken }).lean();
    if (userSession) {
        return true;
    }
    return false;
};

module.exports = sessionService;
