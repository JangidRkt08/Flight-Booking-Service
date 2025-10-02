// Basic Server configuraitopn
const express = require('express')
const {ServerConfig,logger} = require('./config')
const apiRoutes = require('./routes')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,()=>{
    console.log("server started at port 4000");
    // logger.info("successfully started the server",{})
    
})