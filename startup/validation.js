const Joi = require('joi')

// Dodavanje objectId u Joi

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi)
}