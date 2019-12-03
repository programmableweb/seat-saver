const { AuthenticationError } = require("apollo-server");
const config = require('../config');

module.exports =  {
    onConnect: (connectionParams) => {
        const dt = new Date();
        console.log(`Connection made , info ${JSON.stringify(connectionParams)} at ${dt.toString()}`)
    }
};