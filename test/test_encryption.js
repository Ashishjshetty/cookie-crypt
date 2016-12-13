'use strict';
let sinon = require('sinon');
let should = require('should');
let cookie_crypt = require('../');
describe('encryption test', () => {
    it('should encrypt cookie data', (done) => {
        let next = sinon.spy();
        let cookie = cookie_crypt('asfsf');
        let req = {};
        req.cookies = {
            'test': 'cc59b0708e67004304826712f1c07026',
            'test2': 'cc59b0708e67004304826712f1c07026'
        };
        let res = {
            cookie: function (name, value, options) {
                //console.log(name, value, options);
            },
        };
        cookie(req, res, next);
        if (next.called) {
            res.cookie('test2', 'test2');
            done();
            //console.log(req.cookies)
        } else {
            done('asf');
        }

    });
});
