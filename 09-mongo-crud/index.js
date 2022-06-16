const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const {connect} = require('./MongoUtil') //NodeJS assume requiring from node_modules if no ./ specified
const dotenv = require('dotenv').config(); //all variables defined in .env transferred to environment

const ObjectId = require('mongodb').ObjectId
const helpers = require('handlebars-helpers')({
    'handlebars': hbs.handlebars
})

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

function getCheckboxValues(rawTags){
    let tags = [];
        if (Array.isArray(rawTags)){
            tags = rawTags
        } else if (rawTags){
            tags = [rawTags]; 
        }
    return tags
}

async function getFoodRecordById(database, id){
    let foodRecord = await database.collection('food_records').findOne({
        '_id': ObjectId(id)
    })
    return foodRecord
}

async function main(){
    const db = await connect(MONGO_URI, 'tgc18_cico');
    // app.get('/test', async function(req, res){
    //     //Convert results to array of JS objects 
    //     let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
    //     res.send(data);
    // })

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
        let tags = getCheckboxValues(req.body.tags)
    
        let foodDocument = {
            'food': foodRecordName,
            'calories': calories,
            'tags': tags
        }
    
        await db.collection('food_records').insertOne(foodDocument);
        res.send('new food form inserted')
    })

    app.get('/update-food/:id', async function(req, res){
        let id = req.params.id 
        let foodRecord = await getFoodRecordById(db, id)
        res.render('update-food',{
            'foodRecord': foodRecord
        })
    })

    app.post('/update-food/:id', async function(req,res){
        let id = req.params.id;
        // res.send(req.body)
        let updatedFoodRecord = {
            'food': req.body.foodRecordName,
            'calories': req.body.calories,
            'tags': getCheckboxValues(req.body.tags)

        }

        await db.collection('food_records').updateOne({
            '_id': ObjectId(id)
        }, {
            '$set': updatedFoodRecord
        })

        res.redirect('/')
    })

    app.get('/delete-food/:id', async function(req,res){
        let id = req.params.id;
        let foodRecord = await getFoodRecordById(db,id)
        res.render('confirm-delete-food', {
            'foodRecord': foodRecord
        })
    })

    app.post('/delete-food/:id', async function(req,res){
        let id = req.params.id;
        await db.collection('food_records').deleteOne({
            '_id': ObjectId(id)
        })
        res.redirect('/')
    })

    app.get('/food/:id/notes/add', async function(req, res){
        
        
        let foodRecord = await db.collection('food_records').findOne({
            '_id': ObjectId(req.params.id)
        },{
            'projection': {
                'food': 1
            }
        });

        res.render('add-note', {
            foodRecord
        })
    })

    app.post('/food/:id/notes/add', async function(req, res){
        let response = await db.collection('food_records').updateOne({
            '_id': ObjectId(req.params.id)
        }, {
            '$push': {
                'notes': {
                    '_id': ObjectId(), //if no arguement, will automatically create 
                    'content': req.body.content
                }
            }
        })

        res.redirect('/')
    })

    app.get('/food/:id/notes', async function(req,res){
        let foodRecord = await getFoodRecordById(db, req.params.id);
        res.render('show-notes',{
            foodRecord
        })
    })

    app.get('/food/:id/notes/:noteid/update', async function(req, res){
        let foodRecord = await db.collection('food_records').findOne({
            '_id': ObjectId(req.params.id)
        },{
            'projection': {
                'notes':{
                    '$elemMatch': {
                        '_id': ObjectId(req.params.noteid)
                    }
                }
            }
        })
        let noteToEdit = foodRecord.notes[0];
        res.render('edit-note',{
            noteToEdit
        })
    })

    app.post('/food/:id/notes/:noteid/update', async function(req, res){
        let newContent = req.body.content;
        await db.collection('food_records').updateOne({
            '_id': ObjectId(req.params.id),
            'notes._id': ObjectId(req.params.noteid)
        }, {
            '$set':{
                'notes.$.content': newContent 
            }
        })
        res.redirect(`/food/${req.params.id}/notes`)
    })

    app.get('/food/:id/notes/:noteid/delete', async function(req, res){
        let foodRecord = await db.collection('food_records').findOne({
            '_id': ObjectId(req.params.id)
        },{
            'projection': {
                'notes':{
                    '$elemMatch': {
                        '_id': ObjectId(req.params.noteid)
                    }
                }
            }
        })
        let noteToDelete = foodRecord.notes[0];
        res.render('delete-note',{
            'note': noteToDelete
        })
    })
}

main();


app.listen(3000, function(){
    console.log('hello world')
})