// Modul koji pozivamo u index.js nakon svih ostalih middlewarea, app.use(error)
// Hvata svaki error u request processing pipeline-u, logga ga
// error, warn, info, verbose, debug, silly
const winston = require('winston')

module.exports = function(err, req, res, next) {


    winston.error(err.message, err)

    res.status(500).send('Something failed')
}