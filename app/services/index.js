"use strict";
const CONFIG = require("../../config");
/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
module.exports = {
    userService: require(`./boilerplate/userService`),
    swaggerService: require(`./boilerplate/swaggerService`),
    authService: require(`./boilerplate/authService`),
    sessionService: require(`./boilerplate/sessionService`)
};
