const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const subscriptions = require('./graphql/subscriptions');
const {seedVenues} = require('./utilities');
const {validateMessageBroker} = require('./messageBroker');
const {validateDataStore} = require('./dataManager');

const PORT = process.env.PORT || 4000;

let server = null;

validateDataStore()
    .then(result => {
        console.log(result);
        return validateMessageBroker()
    })
    .then(result => {
        console.log(result);
        return seedVenues();
    })
    .then(result => {
        return server = new ApolloServer({
            subscriptions,
            typeDefs,
            resolvers,
        });
    })
    .then(() => {
        return server.listen(PORT)
    })
    .then(({url, subscriptionsUrl}) => {
        process.env.SERVER_CONFIG = JSON.stringify({serverUrl: url, subscriptionsUrl});
        console.log(`Starting servers at ${new Date()}`);
        console.log(`🚀  Server ready at ${url}`);
        console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
    })
    .catch(e => {
        console.error(e);
        if(server){shutdown()} else {process.exit(1)};
    });

const shutdown = () => {
    console.log({message: 'Exiting App', date: new Date()});
    if (server) {
        server.stop();
    } else {
        process.exit(1)
    }
};


//Export the server to make it available to unit and API tests
module.exports = {shutdown, seedVenues};