const CONSTANTS = require('../utils/constants');
const MODELS = require('../models/index');

let dbUtils = {};

/**
 * function to check valid reference from models.
 */
dbUtils.checkValidReference = async (document, referenceMapping) => {
  for (let key in referenceMapping) {
    let model = referenceMapping[key];
    if (!!document[key] && !(await model.findById(document[key]))) {
      throw CONSTANTS.RESPONSE.ERROR.BAD_REQUEST(key + ' is invalid.');
    }
  }
};

/**
 * function to create dummy challenges in the database.
 */
dbUtils.createDummyChallenges = async () => {
  let isJourneyExists = await MODELS.journeyModel.countDocuments();
  if (!isJourneyExists) {
    MODELS.journeyModel(journey).save();
    let challenges = CONSTANTS.DUMMY_CHALLENGES;
    for (let index = 0; index < challenges.length; index++) {
      let challenge = challenges[index];
      await MODELS.challengeModel(challenge).save();
    }
  }
};

module.exports = dbUtils;