const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const dotenv = require('dotenv').config()
const {connect} = require('./MongoUtil')
const ObjectId = require('mongodb').ObjectId
const helpers = require('handlebars-helpers')({
    'handlebars': hbs.handlebars
})

const app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    'extended': false // extended true if processing complicated forms
}))

const MONGO_URI = process.env.MONGO_URI

async function main(){
    const db = await connect(MONGO_URI, 'pet_shelter');
    
    app.get('/', async function(req,res){
        const petRecords = await db.collection('pet_records').find({}).toArray()
        res.render('home', {
            'petRecords': petRecords
    })
})

    app.get('/add-pet', function(req, res){
        res.render('add-pet')
    })

    app.post('/add-pet', async function(req, res){
        // res.send(req.body)
        let tags = [];
        if (Array.isArray(req.body.tags)){
            tags = req.body.tags
        } else if (req.body.tags){
            tags.push(req.body.tags)
        }

        let petDocument = {
            'name': req.body.name,
            'breed': req.body.breed,
            'description': req.body.description,
            'age': req.body.age,
            'tags': tags,
            'hdb-approved': req.body['hdb-approved']
        }

        await db.collection('pet_records').insertOne(petDocument)
        res.redirect('/')
    })

    app.get('/pet/:id', function(req,res){
        res.send(req.params.id)
    })

    app.get('/update-pet/:id', async function(req, res){
        // res.send(req.params.id)
        let petRecord = await db.collection('pet_records').findOne({
            '_id': ObjectId(req.params.id)
        })
        res.render('update-pet', {
            'petRecord': petRecord
        })
    })

    app.post('/update-pet/:id', async function(req, res){
        // res.send(req.body)
        let tags = [];
        if (Array.isArray(req.body.tags)){
            tags = req.body.tags
        } else if (req.body.tags){
            tags.push(req.body.tags)
        }

        let updatedPetDocument = {
            'name': req.body.name,
            'breed': req.body.breed,
            'description': req.body.description,
            'age': req.body.age,
            'tags': tags,
            'hdb-approved': req.body['hdb-approved']
        }
        
        await db.collection('pet_records').updateOne({
            '_id': ObjectId(req.params.id)
        }, {
            '$set': updatedPetDocument
        })

        res.redirect('/')
    })
}

main()

app.listen(3000, function(){
    console.log('server started')
})