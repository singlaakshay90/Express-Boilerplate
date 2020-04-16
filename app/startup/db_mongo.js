const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const CONFIG = require('../../config');

module.exports = async () => {
    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        reconnectTries: 20,
        reconnectInterval: 2000,
    };
    await mongoose.connect(CONFIG.mongoDB.URL, options);
    console.log('Mongo connected at ', CONFIG.mongoDB.URL);
};