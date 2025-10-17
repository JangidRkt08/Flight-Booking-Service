const axios = require("axios");

const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const serverConfig = require("../config/server-config");
const AppError = require("../utils/errors/app-error");
const bookingRepository = new BookingRepository();

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

module.exports = {
  createBooking,
};


// -----> Other Option To manage Transactions  <------

// it will wait for transactrion to complete whether to rollback or commit
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

//   this will not wait for transaction to complete start nd then commit only not rollback
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

