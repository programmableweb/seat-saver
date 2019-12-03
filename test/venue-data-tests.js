const Venue = require('../dataManager/venue');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const faker = require('faker');


const moption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


const getRandomCustomerSync = () => {
    const obj = {};
    obj.firstName = faker.name.firstName();
    obj.lastName = faker.name.lastName();
    const email = `${obj.firstName}.${obj.lastName}@${faker.internet.domainName()}`;
    obj.email = email;

    return obj;
};

describe('Venue Data Tests', () => {

    it('Can save venue with seat', (done) => {
        mongoose.connect(process.env.MONGODB_URL, moption)
            .then(result => {
                const customer = getRandomCustomerSync();
                venue = new Venue();
                venue.name = faker.lorem.words(2);
                venue.address = faker.address.streetAddress();
                venue.city = faker.address.city();
                venue.state_province = faker.address.state();
                venue.postal_code = faker.address.zipCode();
                venue.country = 'USA';
                venue.seats = [{number: 'A10', section: 'Section-A', customer}];
                return venue.save()
            })
            .then(result => {
                console.log(result);
                done();
            })
            .catch(e => {
                done(e)
            });
    });
});
