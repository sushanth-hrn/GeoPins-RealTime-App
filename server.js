const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');
require('dotenv').config();

const { findOrCreateUser } = require('./controllers/userController');

mongoose
    .connect(process.env.MONGO_URI,{ useNewUrlParser:true })
    .then(() => console.log('Connected to Database(Atlas)'))
    .catch((err) => console.error(err));

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser =  null; 
        try {
            authToken = req.headers.authorization;
            if(authToken){
                // find or create user
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (error) {
            console.log(`Unable to authenticate user with token ${authToken}`);
        }
        return { currentUser };
    }
});

server.listen().then(({ url }) => {
    console.log(`Server listening on port ${url}`);
});
