const express = require('express')
const mongoose = require('mongoose')
const {Movie, validate} = require('../models/movie')
const {Genre} = require('../models/genre')
const router = express.Router()
const auth = require('../middleware/auth')


router.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.post('/', auth,  async (req,res) => {
    // Validacija
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0])
    // Pronalazenje genre-a koji će biti embeddan u objekt filma
    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre.')

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    movie = await movie.save()
    res.send(movie)
})

router.put('/:id', auth, async (req, res) => {
    // Validacija
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0])

    // Pronalazenje objekta genrea
    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre.')

    // Update filma, sa update-om genrea ako je to slucaj
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {new: true})

    if(!movie) return res.status(404).send("Can't find movie with that ID")
    res.send(movie)
})

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if(!movie) return res.status(404).send("Can't find movie with that ID")

    res.send(movie)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send("Can't find movie with that ID")

    res.send(movie)
})

module.exports = router