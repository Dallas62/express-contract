'use strict';

const testCase = require('nodeunit').testCase;

const ContractValidator = require('../src/contract-validator');

const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();

app.use(bodyParser.json({
    type: function () { // Force JSON Only
        return true;
    }
}));

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birth_year: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email()
}).with('username', 'birth_year').without('password', 'access_token');

const contract = new ContractValidator(Joi, schema);

app.all('/test', contract.middleware, function (req, res) {
    if(!req.compliance) {
        res.status(400).json({test: 'KO'});
    } else {
        res.status(200).json({test: 'OK'});
    }
});

module.exports = testCase({
    'ContractValidator - Test contract POST OK': function (test) {

        request(app)
            .post('/test')
            .send({ username: 'toto', birth_year: 1994 })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                test.equal(response.body.test, 'OK');
                test.done();
            });
    },
    'ContractValidator - Test contract GET OK': function (test) {

        request(app)
            .get('/test?username=toto&birth_year=1994')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                test.equal(response.body.test, 'OK');
                test.done();
            });
    },
    'ContractValidator - Test contract KO': function (test) {

        request(app)
            .post('/test')
            .send({ username: 'toto', birth_year: 1842 })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                test.equal(response.body.test, 'KO');
                test.done();
            });
    },
    'ContractValidator - Test contract Empty': function (test) {

        request(app)
            .post('/test')
            .send()
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                test.equal(response.body.test, 'KO');
                test.done();
            });
    },
    'ContractValidator - Test contract missing property': function (test) {

        request(app)
            .post('/test')
            .send({ username: 'toto' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                test.equal(response.body.test, 'KO');
                test.done();
            });
    }
});