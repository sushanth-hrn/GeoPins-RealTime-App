const User = require('../models/User');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
require('dotenv').config();

exports.findOrCreateUser = async token => {
    //verify auth token
    const googleUser = await verifyAuthToken(token);
    //check if user exists
    const user = await User.findOne({email:googleUser.email}).exec();
    //if user exists, return them; otherwise create new user in db
    return user ? user : createNewUser(googleUser);
}

const verifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        });
        return ticket.getPayload(); //this will return the googleUser data
    } catch (error) {
        console.error("Error validating the auth token ",error);
    }
}

const createNewUser = (googleUser) => {
    const {name, email, picture} = googleUser;
    const user = {
        name,
        email,
        picture
    }
    return new User(user).save();
}