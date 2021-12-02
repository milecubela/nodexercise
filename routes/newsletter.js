const express = require('express')
const router = express.Router()
const {User, validate} = require('../models/user')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const nodemailer = require('nodemailer')
const winston = require('winston')




// Dohvaća trenutno logiranog usera, i subscribe-a ga na newsletter
router.put('/subscribe', auth, async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        newsletterSubscription: true
    }, { new: true})

    if(!user) return res.status(404).send("Can't find user with that ID")

    res.send(user)
})

// Samo za admine, ruta za slanje newslettera
router.post('/send-emails', [auth, admin], async (req,res) => {
    const user = await User.findById(req.user._id)
    // Hvata iz baze sve mailove koji su subscribani na newsletter
    const emails = await user.getSubscribedEmails()

    
    sendMails(emails)
    
})

async function sendMails(emails) {
    // Stvara testni SMTP account za ethereal.email, za testiranje servisa
    let testAccount = await nodemailer.createTestAccount()

    // transporter object
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
    // Slanje testnog maila
    let info = await transporter.sendMail({
        from: `"Test mail" <test@test.com>`,
        to: emails,
        subject: "Test",
        text: "Test",
        html: ""
    })
    // U log file sprema url da se pogleda testni mail
    winston.info(nodemailer.getTestMessageUrl(info))
}


module.exports = router