"use strict";

const Joi = require("joi");
const CONFIG = require("../../../../config");
// load controllers
const userControllers = require(`../../../controllers/boilerplate/userController`);

let routes = [
    {
        method: "GET",
        path: "/v1/server",
        joiSchemaForSwagger: {
            group: "User",
            description:
                "Route to get server response (Is server working fine or not?).",
            model: "SERVER"
        },
        handler: userControllers.getServerResponse
    },
    {
        method: "POST",
        path: "/v1/user/register",
        joiSchemaForSwagger: {
            body: Joi.object({
                firstName: Joi.string()
                    .required()
                    .description("User's name."),
                lastName: Joi.string()
                    .required()
                    .description("User's name."),
                imageUrl: Joi.string()
                    .allow("")
                    .optional()
                    .description("User's photo url."),
                email: Joi.string()
                    .email()
                    .required()
                    .description("User's email."),
                password: Joi.string()
                    .required()
                    .description("User's password.")
            }).unknown(),
            group: "User",
            description: "Route to register a user.",
            model: "REGISTER_USER"
        },
        handler: userControllers.registerNewUser
    },
    {
        method: "POST",
        path: "/v1/user/login",
        joiSchemaForSwagger: {
            body: Joi.object({
                email: Joi.string().email().required().description("User's email."),
                password: Joi.string().required().description("User's password."),
                fcm_token: Joi.string().optional().description("Device's fcm token.") //if fcm token functionality is there
            }).unknown(),
            group: "Auth",
            description: "Route to login a user.",
            model: "LOG_IN"
        },
        handler: userControllers.loginUser,
    },
    {
        method: "POST",
        path: "/v1/user/logout",
        joiSchemaForSwagger: {
            group: "Auth",
            description: "Route to logout a user.",
            model: "Logout",
            headers: Joi.object({
                authorization: Joi.string().required().description('Users\'s JWT token.')
            }).unknown(),
            model: 'LOG_OUT'
        },
        // auth: AVAILABLE_AUTHS.CUSTOMER,
        handler: userControllers.logout,
    },
    {
        method: "GET",
        path: "/v1/user",
        joiSchemaForSwagger: {
            query: Joi.object({
            }).unknown(),
            group: "User",
            description: "Route to get user lists.",
            model: "GET_USERS"
        },
        // auth: AVAILABLE_AUTHS.CUSTOMER,
        handler: userControllers.getUsers
    },

    {
        method: "GET",
        path: "/v1/user/:id",
        joiSchemaForSwagger: {
            params: Joi.object({
                id: Joi.string().required().description("User's Id")
            }).unknown(),
            group: "User",
            description: "Route to get a user by its id .",
            model: "GET_USER"
        },
        // auth: AVAILABLE_AUTHS.CUSTOMER,
        handler: userControllers.getUserById
    },
    {
        method: 'POST',
        path: '/v1/uploadFile',
        joiSchemaForSwagger: {
            headers: Joi.object({
                'authorization': Joi.string().required().description('User \'s JWT token.')
            }).unknown(),
            formData: {
                file: Joi.any().meta({ swaggerType: 'file' }).required().description(' File')
            },
            group: 'File',
            description: 'Route to upload a file.',
            model: 'FILE_UPLOAD'
        },
        requestTimeout: true,
        auth: false,
        // auth: AVAILABLE_AUTHS.CUSTOMER,
        handler: userControllers.uploadFile
    },
    {
        method: 'POST',
        path: '/v1/uploadFiles',
        joiSchemaForSwagger: {
            headers: Joi.object({
                'authorization': Joi.string().required().description('User \'s JWT token.')
            }).unknown(),
            formData: {
                file: Joi.any().meta({ swaggerType: 'file' }).required().description('Image File.')
            },
            group: 'File',
            description: 'Route to upload multiple files.',
            model: 'FILE_MULTIPLE_UPLOAD'
        },
        requestTimeout: true,
        auth: false,
        // auth: AVAILABLE_AUTHS.CUSTOMER,
        handler: userControllers.uploadMultipleFiles
    },

];

module.exports = routes;
