"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;
const { hashPassword } = require('../../utils/utils')
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    email: { type: String, required: true, index: true },
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    imageUrl: { type: String },
    password: { type: String, required: true, }
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date }
},
    {
        timestamps: true
    });


// pre-hook to store password hash
userSchema.pre('save', async function (next) {
    if (this.password) this.password = hashPassword(this.password);
    next();
});
module.exports = MONGOOSE.model("user", userSchema);
