const cron = require("node-cron");
// const { BookingRepository } = require("../../repositories");
const {bookingService} = require('../../services/')

function scheduleCrons(){

    cron.schedule('*/10 * * * *',async () => {  // every 10 minutes
      console.log("running a task every 10 minutes");
        const response = await bookingService.cancelOldBookings();
        console.log(response);
        
    });
}

module.exports= scheduleCrons



