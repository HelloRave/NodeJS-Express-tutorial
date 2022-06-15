const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const MongoClient = require('mongodb').MongoClient //return mongo object and find MongoClient(MongoShell that can be controlled in NodeJS) in the object
const dotenv = require('dotenv').config(); //all variables defined in .env transferred to environment

//process is a NodeJS object automatically available to all NodeJS programs; process variable refers to the current NodeJS that is running
// .env is the environment - it is where the OS stores its variables 
console.log(process.env); 

const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const MONGO_URI = process.env.MONGO_URI

async function main(){
    const client = await MongoClient.connect(MONGO_URI, {
        'useUnifiedTopology': true //different versions of Mongo; when set to true, regardless of versions
    }) //.connect takes in two arguement - 1st the connection string, 2nd an option string

    const db = client.db('sample_airbnb')

    app.get('/test', async function(req, res){
    //Convert results to array of JS objects 
    let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
    res.send(data);
})
}

main();

app.get('/', function(req,res){
    res.render('hello')
})

app.listen(3000, function(){
    console.log('hello world')
})