const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const {connect} = require('./MongoUtil') //NodeJS assume requiring from node_modules if no ./ specified
const dotenv = require('dotenv').config(); //all variables defined in .env transferred to environment

//process is a NodeJS object automatically available to all NodeJS programs; process variable refers to the current NodeJS that is running
// .env is the environment - it is where the OS stores its variables 
// console.log(process.env); 

const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.use(express.urlencoded({
    extended: false
}))

const MONGO_URI = process.env.MONGO_URI

async function main(){
    const db = await connect(MONGO_URI, 'tgc18_cico');
    app.get('/test', async function(req, res){
        //Convert results to array of JS objects 
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    })

    app.get('/', async function(req,res){
        const allFoodRecords = await db.collection('food_records').find({}).toArray()
        res.render('all-food',{
            'allFood': allFoodRecords
        })
    })

    app.get('/add-food', function(req,res){
        res.render('add-food')
    })
    
    app.post('/add-food', async function(req,res){
        console.log(req.body)
        let foodRecordName = req.body.foodRecordName;
        let calories = req.body.calories;
        let tags = [];
        if (Array.isArray(req.body.tags)){
            tags = req.body.tags
        } else if (req.body.tags){
            tags = [req.body.tags]; 
        }
    
        let foodDocument = {
            'food': foodRecordName,
            'calories': calories,
            'tags': tags
        }
    
        await db.collection('food_records').insertOne(foodDocument);
        res.send('new food form inserted')
    })
}

main();


app.listen(3000, function(){
    console.log('hello world')
})