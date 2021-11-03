const winston = require('winston')
// require('winston-mongodb')
require('express-async-errors') // npm package koji zamjenjuje async middleware

module.exports = function() {
    // Hvatanje exceptiona uz koristenje process objekta na razini node-a, logging
// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex)
//     process.exit(1)
// })

winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({filename: 'uncaughtExceptions.log'}))

// Handleanje promise rejectiona 
process.on('unhandledRejection', (ex) => {
    // winston.error(ex.message, ex)
    // process.exit(1)
    throw ex;
})


winston.add(new winston.transports.File ({filename: 'logfile.log'}))
winston.add(new winston.transports.File({
    level: 'info', 
    filename: 'info.log'
}))
// winston.add(new winston.transports.MongoDB ({
//     db: 'mongodb://localhost/vidly',
//     level: 'info'
// }))
}