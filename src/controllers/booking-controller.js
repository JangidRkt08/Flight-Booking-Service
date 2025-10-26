
const {bookingService} = require('../services')
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const inMemDb = {};
async function createBooking(req, res) {

  try {
    const response = await bookingService.createBooking(
        {
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        }
    );
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function makePayment(req, res) {

  try {
    const idempotencyKey = req.headers['x-idempotency-key'];
    if(!idempotencyKey ){      
      return res
      .status( StatusCodes.BAD_REQUEST)
      .json({
        message: "Idempotency key is missing",
      });
    }
    if(inMemDb[idempotencyKey]){
     return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "Cannot retry on Successful Payment",
      });
    }
    const response = await bookingService.makePayment(
      {
        bookingId: req.body.bookingId,
        totalCost: req.body.totalCost,
        userId: req.body.userId,
      }
    );
    inMemDb[idempotencyKey] = idempotencyKey
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

module.exports = {
    createBooking,
    makePayment
}