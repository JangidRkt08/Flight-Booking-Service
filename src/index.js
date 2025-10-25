// Basic Server configuraitopn
const express = require('express')
const {ServerConfig,logger} = require('./config')
const apiRoutes = require('./routes')
const cronJobs = require('./utils/common/cron-jobs')
const app = express()
const CRON = require('./utils/common/cron-jobs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,()=>{
    console.log("server started at port 4000");
    CRON();
    // logger.info("successfully started the server",{})
    
})