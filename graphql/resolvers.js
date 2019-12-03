const {
    getVenues,
    getVenue,
    getReservedSeats,
    getOpenSeats,
    getSoldSeats,
    reserveSeat,
    buySeat,
    releaseSeat
} = require('../dataManager');
const {pubsub} = require('../messageBroker');
const SEAT_STATUS_TOPIC = 'Seat_Status_Topic';

const createSeatPayloadSync =  (seat, msg) =>{
    if(seat.id)(seat.seatId = seat.id);
    const payload = {
        venueId: seat.venueId,
        message: msg,
        seatId: seat.seatId,
        number: seat.number,
        section:  seat.section,
        status: seat.status,
        changeDate: new Date()
    };
    return payload;
};


module.exports = {
    Object: {
        __parseValue(value) {
            return JSON.parse(value)
        },
        __serialize(value) {
            return value;
        }
    },
    Date: {
        __parseValue(value) {
            return new Date(value); // value from the client
        },
        __serialize(value) {
            return value;
        }
    },
    Query: {
        soldSeats: async (parent, args, context) => {return await getSoldSeats(args.venueId)},
        reservedSeats: async (parent, args, context) => {return await getReservedSeats(args.venueId)},
        openSeats:async (parent, args, context) => {
            return await getOpenSeats(args.venueId)
        },
        venue:async (parent, args, context) => {return await getVenue(args.id)},
        venues:async (parent, args, context) => {return await getVenues()},
    },
    Mutation: {
        reserveSeat:  async (parent, args) => {
            args.seat.status = 'RESERVING';
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatReserved:createSeatPayloadSync(args.seat, 'Reserving Seat')});
            args.seat.status = 'RESERVED';
            const result = await reserveSeat(args.seat);
            result.venueId = args.seat.venueId; //yes, this is a hack.
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatReserved:createSeatPayloadSync(result, 'Reserved Seat')});
            return result;
        },
        releaseSeat:  async (parent, args) => {
            args.seat.status = 'RELEASING';
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatReleased:createSeatPayloadSync(args.seat, 'Releasing Seat')});
            args.seat.status = 'OPEN';
            const result =  await releaseSeat(args.seat);
            result.venueId = args.seat.venueId;
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatReleased:createSeatPayloadSync(result, 'Released Seat')});
            return result;
        },
        buySeat:  async (parent, args) => {
            args.seat.status = 'SELLING';
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatSold:createSeatPayloadSync(args.seat, 'Buying Seat')});
            args.seat.status = 'SOLD';
            const result =   await buySeat(args.seat);
            result.venueId = args.seat.venueId;
            await pubsub.publish(SEAT_STATUS_TOPIC, {onSeatSold:createSeatPayloadSync(result, 'Bought Seat')});
            return result;
        }
    },
    Subscription: {
        onSeatReleased: {
            subscribe: () => pubsub.asyncIterator(SEAT_STATUS_TOPIC)
        },
        onSeatReserved: {
            subscribe: () => pubsub.asyncIterator(SEAT_STATUS_TOPIC)
        },
        onSeatSold: {
            subscribe: () => pubsub.asyncIterator(SEAT_STATUS_TOPIC)
        },
    }
};