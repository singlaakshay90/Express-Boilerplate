"use strict";
/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
/**************************************************
 ************* Session Model or Collection ***********
 **************************************************/
const sessionSchema = new Schema({
    userId: { type: String },
    token: { type: String },
    createdAt: { type: Date, default: Date.now },
    tokenExpDate: { type: Date },
    updatedAt: { type: Date },
});

module.exports = MONGOOSE.model('session', sessionSchema);
