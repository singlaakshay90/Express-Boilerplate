const expect = require('chai').expect;
const request = require('request');
const CONFIG = require('../config');
const { SECURITY } = require('../app/utils/constants');
const BASE_URL = CONFIG.server.URL;

/**
 * Test cases for all end points.
 */
describe('#API Integration:', () => {

    // check base path GET request only. (Server is working or not)
    it('Base Path request', function (done) {
        request(`${BASE_URL}/v1/user`, function (error, response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    //test case for get all Challenges endpoint (with authorization).
    it('Fetch all challenges', function (done) {
        request.get({
            url: `${BASE_URL}/v1/challenge`,
            headers: {
                authorization: SECURITY.STATIC_TOKEN_FOR_AUTHORIZATION
            }
        }, (error, response) => {
            responseBody = JSON.parse(response.body);
            // * here we expect success response.
            // challenges must be an array.
            expect(responseBody)
                .to.have.property('challenges')
                .to.have.an.instanceOf(Array);
            // response object has the required keys.
            expect(responseBody)
                .to.be.an.instanceof(Object)
                .that.includes.all.keys(['statusCode', 'msg', 'status', 'challenges']);

            // response object has the status true.
            expect(responseBody).to.have.property('status').to.equal(true);

            // response object has the statusCode 200.
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    //test case for get all Challenges endpoint (invalid authorization).
    it('Fetch all challenges(invalid authorization)', function (done) {
        request.get({
            url: `${BASE_URL}/v1/challenge`,
            headers: {
                authorization: 'jfaskjfioagnjkasnfjnfdlakjf'
            }
        }, (error, response) => {
            responseBody = JSON.parse(response.body);
            // * here we expect un-authorized access because authorization has invalid token.
            // response object has the status false.
            expect(responseBody).to.have.property('status').to.equal(false);

            // response object has the statusCode 401.
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    //test case for get all Challenges endpoint (without authorization).
    it('Fetch all challenges(without authorization)', function (done) {
        request.get({
            url: `${BASE_URL}/v1/challenge`,
        }, (error, response) => {
            responseBody = JSON.parse(response.body);
            // * here we expect bad request because authorization key is required in headers.
            // response object has the status false.
            expect(responseBody).to.have.property('status').to.equal(false);

            // response object has the statusCode 400.
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    //test case for get single challenge endpoint.
    it('Fetch single challenge using its id', function (done) {
        request.get({
            url: `${BASE_URL}/v1/challenge/5d89cbede5226ceefbb35349`,
            headers: {
                authorization: SECURITY.STATIC_TOKEN_FOR_AUTHORIZATION
            }
        }, (error, response) => {
            responseBody = JSON.parse(response.body);
            // * here we expect success response.
            // challenge must be an object.
            expect(responseBody)
                .to.have.property('challenge')
                .to.have.an.instanceOf(Object);

            // challenge id is equal to the id that passed in request params.
            expect(responseBody.challenge).to.have.property('_id').to.equal("5d89cbede5226ceefbb35349");

            // response object has the status true.
            expect(responseBody).to.have.property('status').to.equal(true);

            // response object has the statusCode 200.
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});