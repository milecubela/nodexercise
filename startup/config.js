const config = require('config')

// Provjera config file-a
module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
        process.exit(1)
    }
    
}