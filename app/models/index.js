'use strict';
const CONFIG = require('../../config');
/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    userModel: require(`../models/${CONFIG.PLATFORM}/userModel`),
    sessionModel: require(`../models/${CONFIG.PLATFORM}/sessionModel`),
};