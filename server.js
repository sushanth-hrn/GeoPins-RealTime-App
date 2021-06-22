const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');
require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URI,{ useNewUrlParser:true })
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.error(err));

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server listening on port ${url}`);
});
