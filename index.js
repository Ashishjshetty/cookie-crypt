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
  decrypted += decipher.final('utf8');
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
      // console.log('cookie called', name, value);
      
      value = encryptThis(JSON.stringify(value), secret);
    
      mainCookie.call(this, name, value, options);
    };
    var cookies = Object.keys(req.cookies);
    cookies.forEach(function (userData) {
      var decUserData = JSON.parse((req.cookies[userData]) ? decryptThis(req.cookies[userData], secret) : req.cookies[userData]);
      req.cookies[userData] = decUserData;
    });
    next();
  };
}
module.exports = cookieCrypt;