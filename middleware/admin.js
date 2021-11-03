// Poziva se nakon auth.js middlewarea, u kojem je req.user postavljen

module.exports = function (req, res, next) {
    // 401 Unathorized, 403 forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied')

    next()
}