// Basic Server configuraitopn
const express = require('express')
const {ServerConfig,logger} = require('./config')
const apiRoutes = require('./routes')
const app = express()


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,()=>{
    console.log("server started at port 3000");
    // logger.info("successfully started the server",{})
    
})