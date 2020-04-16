"use strict";

const swaggerUI = require("swagger-ui-express");
const SERVICES = require("../services");
const Joi = require("joi");
let path = require("path");

const CONFIG = require("../../config");
const { MESSAGES, ERROR_TYPES, AVAILABLE_AUTHS, SERVER } = require("./constants");
const HELPERS = require("../helpers");
const utils = require("./utils");
const multer = require("multer");
const uploadMiddleware = multer();

let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
    routes.forEach(route => {
        let middlewares = [getValidatorMiddleware(route)];
        if (route.auth === AVAILABLE_AUTHS.USER) {
            middlewares.push(SERVICES.authService.userValidate());
        }
        if (route.joiSchemaForSwagger.formData) {
            const keys = Object.keys(route.joiSchemaForSwagger.formData);
            keys.forEach(key => {
                // *****  for single file *****  middlewares.push(uploadMiddleware.single(key)); 
                middlewares.push(uploadMiddleware.array(key));
            });
            if (route.requestTimeout) {
                middlewares.push(checkRequestTimeOut());
            };
        }
        app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
    });
    createSwaggerUIForRoutes(app, routes);
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route
 */
let joiValidatorMethod = async (request, route) => {
    if (
        route.joiSchemaForSwagger.params &&
        Object.keys(route.joiSchemaForSwagger.params).length
    ) {
        request.params = await Joi.validate(
            request.params,
            route.joiSchemaForSwagger.params
        );
    }
    if (
        route.joiSchemaForSwagger.body &&
        Object.keys(route.joiSchemaForSwagger.body).length
    ) {
        request.body = await Joi.validate(
            request.body,
            route.joiSchemaForSwagger.body
        );
    }
    if (
        route.joiSchemaForSwagger.query &&
        Object.keys(route.joiSchemaForSwagger.query).length
    ) {
        request.query = await Joi.validate(
            request.query,
            route.joiSchemaForSwagger.query
        );
    }
    if (
        route.joiSchemaForSwagger.headers &&
        Object.keys(route.joiSchemaForSwagger.headers).length
    ) {
        let headersObject = await Joi.validate(
            request.headers,
            route.joiSchemaForSwagger.headers
        );
        request.headers.authorization = headersObject.authorization;
    }
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route
 */
let getValidatorMiddleware = route => {
    return (request, response, next) => {
        joiValidatorMethod(request, route)
            .then(result => {
                return next();
            })
            .catch(err => {
                let error = utils.convertErrorIntoReadableForm(err);
                let responseObject = HELPERS.responseHelper.createErrorResponse(
                    error.message.toString(),
                    ERROR_TYPES.BAD_REQUEST
                );
                return response
                    .status(responseObject.statusCode)
                    .json(responseObject);
            });
    };
};

/**
 * middleware
 * @param {*} handler
 */
let getHandlerMethod = route => {
    let handler = route.handler;
    return (request, response) => {
        let payload = {
            authorization: request.headers.authorization,
            ...(request.body || {}),
            ...(request.params || {}),
            ...(request.query || {}),
            file: request.file || {}, // single file 
            files: request.files || {}, //multiple files
            user: request.user ? request.user : {}
        };

        //request handler/controller
        if (route.getExactRequest) {
            request.payload = payload;
            payload = request;
        }
        handler(payload)
            .then(result => {
                if (result.filePath) {
                    let filePath = path.resolve(
                        __dirname + "/../" + result.filePath
                    );
                    return response
                        .status(result.statusCode)
                        .sendFile(filePath);
                } else if (result.redirectUrl) {
                    return response.redirect(result.redirectUrl);
                }
                response.status(result.statusCode).json(result);
            })
            .catch(err => {
                console.log("Error is ", err);
                if (!err.statusCode && !err.status) {
                    err = HELPERS.responseHelper.createErrorResponse(
                        MESSAGES.SOMETHING_WENT_WRONG,
                        ERROR_TYPES.INTERNAL_SERVER_ERROR
                    );
                }
                response.status(err.statusCode).json(err);
            });
    };
};

/**
 * function to create Swagger UI for the available routes of the application.
 * @param {*} app Express instance.
 * @param {*} routes Available routes.
 */
let createSwaggerUIForRoutes = (app, routes = []) => {
    const swaggerInfo = CONFIG.swagger.info;
    const swJson = SERVICES.swaggerService;
    swJson.swaggerDoc.createJsonDoc(swaggerInfo);
    routes.forEach(route => {
        swJson.swaggerDoc.addNewRoute(
            route.joiSchemaForSwagger,
            route.path,
            route.method.toLowerCase()
        );
    });

    const swaggerDocument = require("../../swagger.json");
    app.use(
        CONFIG.SWAGGER_PATH,
        swaggerUI.serve,
        swaggerUI.setup(swaggerDocument)
    );
};

/**
 * middleware  to check response timeout of user.
 */
let checkRequestTimeOut = () => {
    return function (request, response, next) {
        response.setTimeout(SERVER.RESPONSE_TIMEOUT, function () {
            let responseObject = HELPERS.responseHelper.createErrorResponse(MESSAGES.REQUEST_TIMEOUT, ERROR_TYPES.TIMEOUT);
            return response.status(responseObject.statusCode).json(responseObject);
        });
        return next();
    }
};
module.exports = routeUtils;
