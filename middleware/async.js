// Modul za uklanjanje try/catch blokova iz async handlera. Kao parametar prima handler
// Express handleri se pozivaju na runtime-u, i inace se salje samo function reference
// Zbog toga middleware returna novi express handler, u kojem se nalazi try/catch kod
// Kao parametar prima kod handlera

// Ovaj pristup se moze zamjeniti sa packageom express-async-errors - npm i express-async-errors 

module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try{
            await handler(req, res)
        }
        catch(ex) {
            next(ex)
        }
    }
    
}