const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean,
    newsletterSubscription: {
        type: Boolean,
        default: false
    }
})

// generiranje jwt tokena za usera
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}

// Funkcija koja vraća listu mailova koji su subscribani na newsletter
userSchema.methods.getSubscribedEmails = async function() {
    const emails = []
    const users = await User.find({ newsletterSubscription: true})

    users.forEach(user => {
        emails.push(user.email)
    })
    //console.log(emails)
    return emails
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    })

    return schema.validate(user)
}

exports.User = User
exports.validate = validateUser
