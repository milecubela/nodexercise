const express = require('express')
const mongoose = require('mongoose')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const {Rental, validate} = require('../models/rental')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort("-dateOut")

    res.send(rentals)
})

router.post('/', auth, async(req, res) => {
    // Validacija poslanog rentala
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Trazenje customera koji uzima rental
    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(404).send("Customer with given ID doesn't exist")

    // Trazenje filma koji renta
    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(404).send("Movie with given ID doesn't exist")

    if(movie.numberInStock === 0) return res.status(400).send("Movie not available for rental")

    // Stvaranje rentala
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: 0
    })
    rental = await rental.save()

    movie.numberInStock--
    movie.save()

    res.send(rental)
})

module.exports = router