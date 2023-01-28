const router = require('express').Router()
const authController = require('../controllers/authController')
const { userValidationMiddleware } = require('../validation/userValidation')
require('../utils/passportOAuth')
const passport = require('passport')
router.post('/signup', userValidationMiddleware, authController.signup)
router.post('/login', authController.login)

//GOOGLE OAUTH
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

//GITHUB OAUTH
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))

//OAUTH CALLBACKS
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log('Here now!');
    return res.redirect('/api/v1/users/protected')
})

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    return res.redirect('/api/v1/users/protected')
})


// TODO: 
// AUTHORIZATION TO PROTECTED ROUTES
router.get('/protected', authController.profile)

// router.get('/protected', (passport.authenticate('session')), authController.profile)

// LOGOUT - DESTROY SESSION
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        return res.redirect('/')
    })
})

module.exports = router