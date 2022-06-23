const express = require('express');
require('dotenv').config() // load variables in env file into the OS 
const MongoUtil = require('./MongoUtil') // require a MongoUtil.js file
const MONGO_URI = process.env.MONGO_URI
const cors = require('cors')

let app = express()

// RESTFUL API expects data sent to the endpoint should be in JSON format, we need to tell
// express to configure all received data to be converted to JSON

app.use(express.json())

app.use(cors()) // enable cross site origin resources sharing 

app.get('/', function(req, res){
    res.send('hello world')
})

app.listen(3000, function(){
    console.log('server started')
})