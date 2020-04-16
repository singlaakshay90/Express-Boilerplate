"use strict";

/***********************************
 **** Node modules defined here *****
 ***********************************/
require("dotenv").config();
const EXPRESS = require("express");

const CONFIG = require("./config");
/**creating express server app for server */
const app = EXPRESS();

/********************************
 ***** Server Configuration *****
 ********************************/
app.set("port", CONFIG.server.PORT);


/******** Socket Configuration  with  app server **********/
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Server is running here **/
let startNodeserver = async () => {
    // express startup.
    await require(`./app/startup/${CONFIG.PLATFORM}/expressStartup`)(app);
    //socket startup
    await require(`./app/socket/${CONFIG.PLATFORM}/socket`).connect(io);
    return new Promise((resolve, reject) => {
        app.listen(CONFIG.server.PORT, err => {
            if (err) reject(err);
            resolve();
        });
    });
};

startNodeserver()
    .then(() => {
        console.log("Node server running on ", CONFIG.server.URL);
        //open swagger API documentation 
        require('open')(CONFIG.server.URL + CONFIG.SWAGGER_PATH);
    })
    .catch(err => {
        console.log("Error in starting server", err);
        process.exit(1);
    });
