const passport = require('passport')
require('dotenv').config()

//OAuthController
const { checkOrCreateOAuthUser } = require('../controllers/authController')

//STARTEGIES
const GoogleStrategy = require('passport-google-oauth2').Strategy

const GithubStrategy = require('passport-github2').Strategy


// GOOGLE STARTEGY
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3310/api/v1/users/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {

    console.log(req);

    const googleDetails = {
        socialId: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        username: profile.displayName
    }

    // Check if user exist or Create user
    await checkOrCreateOAuthUser(googleDetails)

    done(null, profile)
}
))

// GITHUB STARTEGY
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3310/api/v1/users/auth/github/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {

    const githubDetails = {
        socialId: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        username: profile.username
    }

    // Check if user exist or Create user
    await checkOrCreateOAuthUser(githubDetails)

    done(null, profile)
}
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})