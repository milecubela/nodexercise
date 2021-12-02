// Ucitavanje routera

const express = require('express')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middleware/error')
const newsletter = require('../routes/newsletter')

module.exports  = function(app) {
    app.use(express.json())
    app.use('/api/genres', genres)
    app.use('/api/customers', customers)
    app.use('/api/movies', movies)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use('/api/newsletter', newsletter)
    app.use(error) // Middleware koji se poziva nakon svih ostalih middleware-a, u ovom slucaju za loggin errors
}