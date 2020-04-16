"use strict";

const CONFIG = require("../../config");

/********************************
 **** Managing all the routes ***
 ********* independently ********
 ********************************/
const Routes = [...require(`./boilerplate/v1`)];
module.exports = Routes;
