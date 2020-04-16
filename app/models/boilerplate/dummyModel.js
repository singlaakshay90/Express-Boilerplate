"use strict";
/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { CHALLENGE_VALIDATION_TYPES, CHALLENGE_TYPES } = require('../../utils/constants');
/**************************************************
 ************* Challenge Model or Collection ***********
 **************************************************/
const challengeSchema = new Schema({
    validation: { type: Number, enum: [CHALLENGE_VALIDATION_TYPES.MANUAL, CHALLENGE_VALIDATION_TYPES.SEMI_AUTOMATIC, CHALLENGE_VALIDATION_TYPES.AUTOMATIC] },
    xpValue: { type: Number },
    type: { type: Number, enum: [CHALLENGE_TYPES.JOURNEY, CHALLENGE_TYPES.SINGLE_CHALLENGE] },
    title: { type: String },
    summary: { type: String },
    body: { type: String },
    journey: { type: Schema.Types.ObjectId, ref: 'journey' },
    step: { type: Number },
    badge: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }            // for soft delete concept.
});

module.exports = MONGOOSE.model('challenge', challengeSchema);
