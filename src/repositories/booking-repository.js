const {StatusCodes} = require('http-status-codes')

const {Booking} = require('../models')
const Crudrepository = require('./crud-repository')

class BookingRepository extends Crudrepository{
    constructor(){
        super(Booking)
    }

    // we donnot use crud method for creating final booking because we are going to pass transaction object
    async createBooking(data,transaction){
        const response = await Booking.create(data,{transaction:transaction})
        return response
    }
}

module.exports = BookingRepository;