const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const dotenv = require('dotenv').config()
const {connect} = require('./MongoUtil')

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
        let name = req.body.name;
        let breed = req.body.breed; 
        let description = req.body.description;
        let age = req.body.age;
        let tags = [];
        if (Array.isArray(req.body.tags)){
            tags = req.body.tags
        } else if (req.body.tags){
            tags.push(req.body.tags)
        }

        let petDocument = {
            'name': name,
            'breed': breed,
            'description': description,
            'age': age,
            'tags': tags
        }

        await db.collection('pet_records').insertOne(petDocument)
        res.send('Form submitted')
    })

    app.get('/pet/:id', function(req,res){
        res.send(req.params.id)
    })
}

main()

app.listen(3000, function(){
    console.log('server started')
})