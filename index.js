'use strict';

var crypto = require('crypto');

/**
 * Encrypt the data provided using the provided secret key
 * 
 * @param {String} data
 * @param {String} secret
 * @returns
 */
//TODO: add encryption options
function encryptThis(data, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
/**
 * Decrypt the data provide using the provided secret key
 * 
 * @param {String} data
 * @param {String} secret
 * @returns
 */
//TODO: add encryption options
function decryptThis(data, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var decrypted = decipher.update(data, 'hex', 'utf8');
  //console.log('1',decrypted);
  decrypted += decipher.final('utf8');
  //console.log('2',decipher);
  return decrypted;
}
/**
 * Encrypt your cookies as well as decrypt cookies automatically on every request 
 * 
 * @param {String} secret
 * @param {Object} options
 * @returns
 */
function cookieCrypt(secret, options) {
  return function cookieCrypt(req, res, next) {
    if (typeof res.cookie !== 'function' || typeof req.cookies !== 'object') {
      return next();
    }
    var mainCookie = res.cookie;
    res.cookie = function (name, value, options) {
      
      if (options === undefined  || options.noEncrypt !== true) {
        value = encryptThis(JSON.stringify(value), secret);
      }
      //console.log('cookie called', name, value);
      mainCookie.call(this, name, value, options);
    };
    var cookies = Object.keys(req.cookies);
    cookies.forEach(function (userData) {
      //console.log(req.cookies[userData]);
      var data = null;
      var decUserData = null;
      try {
        //console.log(data, typeof data);
        data = JSON.parse(req.cookies[userData]);
      } catch (ex) {
        //console.log('not json');
      }
      try {
        decUserData = (data === null) ? decryptThis(req.cookies[userData], secret) : req.cookies[userData];
      } catch (error) {
        //console.log('not encrypted');
      }
      req.cookies[userData] = (decUserData) ? decUserData : req.cookies[userData];
    });
    next();
  };
}
module.exports = cookieCrypt;
