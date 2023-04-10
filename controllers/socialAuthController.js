require('express-async-errors')
require("dotenv").config();

const redirectURL = 'http://localhost:3000'


const socialAuth = (req, res, next) => {

    // OBTAIN USER DETAILS FROM SESSION
    const {
        user: { user, token, oldUser }
    } = req.session.passport;

    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token to client
    res.cookie("jwt", token, cookieOptions);

    res.redirect('https://test-social.vercel.app/')

}

module.exports = { socialAuth }
