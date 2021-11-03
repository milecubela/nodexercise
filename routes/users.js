const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const mongoose = require('mongoose')
const {User, validate} = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send('Invalid user input')

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send('User already registered')

    // Koristenje lodash za biranje parametara iz requesta, _.pick() , lodash.com dokumentacija librarya
    user = new User(_.pick(req.body, ['name', 'email', 'password']))

    // Generiranje salta za hashiranje passworda
    const salt = await bcrypt.genSalt(10)
    // Hashiranje passworda i spremanje u user objekt
    user.password = await bcrypt.hash(user.password , salt)

    await user.save()

    // Generiranje jwt tokena, u ovom slucaju nakon registera korisnik ostaje logiran
    const token = user.generateAuthToken()

    // Vracanje tokena u header, custom headeri koriste x- ispred
    // Biranje koje propertye vracamo u response, da se ne vrati password
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router