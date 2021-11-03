const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {Genre, validate} = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')



router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres)

})
 
// Dodavanje novog genrea
router.post('/', auth, async (req, res) => {


    // Validacija inputa, definirana u validateGenre() funkciji
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let genre = new Genre({ name: req.body.name })
    genre = await genre.save()

    res.send(genre)
})

// Update
router.put('/:id', auth, async (req, res) => {
    // Validacija
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)    
    
    // Pronalazenje genrea, i odmah update. Vraca updateovani dokument sa new: true

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, { new: true}) 

    if(!genre) return res.status(404).send(`Can't find genre by that ID`)

     // slanje u response 
    res.send(genre)
})

//Brisanje
router.delete('/:id', [auth, admin], async (req, res) => {

    
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre) return res.status(404).send(`Can't find genre by that ID`)
 
    res.send(genre)
})

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID doesnt exist')

    res.send(genre)
})



module.exports = router;