const axios = require("axios");

const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const serverConfig = require("../config/server-config");
const AppError = require("../utils/errors/app-error");
const bookingRepository = new BookingRepository();
const {Enums} = require('../utils/common')
const {
  PENDING,
  BOOKED,
  CANCELLED,
  INITIATED

} = Enums.BOOKING_STATUS

async function createBooking(data) {
  // Unmanaged Transaction
  console.log(data);
  
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data;
    if (data.noOfSeats > flightData.data.totalSeats) {
      throw new AppError("Not enough seats", StatusCodes.BAD_REQUEST); // it goes to catch block and transaction rollback
    }

    const totalBillingAmount = data.noOfSeats * flightData.data.price;
    // console.log(totalBillingAmount);

    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    // After booking update the remaining seats in the flight according to flight Id

     await axios.patch(
      `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );



    // console.log(flight.data);
    await transaction.commit();
    return booking;
    //   });
  } catch (error) {
    // console.log(error)

    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data){
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
    if(bookingDetails.totalCost != data.totalCost){
      throw new AppError("The Amount of the Payment doesn't match",StatusCodes.BAD_REQUEST)
    }
    if(bookingDetails.userId != data.userId){
      throw new AppError("The User Id doesn't match",StatusCodes.BAD_REQUEST)
    }
    // console.log(bookingDetails);
    
    // we assume that the payment is successful
    const response = await bookingRepository.update(
      data.bookingId,
      {status: BOOKED},
      transaction
    )
    await transaction.commit();
    // return response
    
  } catch (error) {
      await transaction.rollback();
    throw error;
  }
}

module.exports = {
  createBooking,
  makePayment
};


// -----> Other Option To manage Transactions  <------

// 1. it will wait for transactrion to complete whether to rollback or commit
//   try {
//     const result = await db.sequelize.transaction(async function bookingImpl(
//       t
//     ) {
//       const flight = await axios.get(
//         `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
//       );
//       const flightData = flight.data;
//       if (data.noOfSeats > flightData.data.totalSeats) {
//         throw new AppError("Not enough seats", StatusCodes.BAD_REQUEST); // it goes to catch block and transaction rollback
//       }
//       console.log(flight.data);
//       return true;
//     });
//   } catch (error) {
//     // console.log(error)

//     throw error;
//   }

// 2.  this will not wait for transaction to complete start nd then commit only not rollback
//   return new Promise((resolve, reject) => {
//     const result = db.sequelize.transaction(async function bookingImpl(t) {
//       const flight = await axios.get(
//         `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
//       );
//       const flightData = flight.data;
//       if (data.noOfSeats > flightData.data.totalSeats) {
//         reject(new AppError("Not enough seats", StatusCodes.BAD_REQUEST)); // it goes to catch block and transaction rollback
//       }
//       resolve(true);
//     });
//   });

