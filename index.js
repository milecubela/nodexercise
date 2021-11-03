const Express = require('express')
const app = new Express()
const winston = require('winston')


require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/database')()
require('./startup/config')()
require('./startup/validation')


const port = process.env.PORT || 3000
const server = app.listen(port, () => winston.info(`Listening on port ${port}`))

module.exports = server;