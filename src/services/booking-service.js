const axios = require("axios");

const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const serverConfig = require("../config/server-config");
const AppError = require("../utils/errors/app-error");
async function createBooking(data) {
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
  return new Promise((resolve, reject) => {
    const result = db.sequelize.transaction(async function bookingImpl(t) {
      const flight = await axios.get(
        `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      const flightData = flight.data;
      if (data.noOfSeats > flightData.data.totalSeats) {
        reject(new AppError("Not enough seats", StatusCodes.BAD_REQUEST)); // it goes to catch block and transaction rollback
      }
      resolve(true);
    });
  });
}

module.exports = {
  createBooking,
};
