const {StatusCodes} = require('http-status-codes')

const {Boooking} = require('../models')
const Crudrepository = require('./crud-repository')

class BookingRepository extends Crudrepository{
    constructor(){
        super(Boooking)
    }
}

module.exports = BookingRepository;