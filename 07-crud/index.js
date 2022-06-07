const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios'); 

const app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}))

const BASE_API_URL = 'https://ckx-restful-api.herokuapp.com/'

app.get('/', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'sightings')
    res.render('sightings', {
        'foodSightings': response.data
    })
})

app.get('/food_sighting/create', function(req, res){
    res.render('food_form')
})

app.post('/food_sighting/create', async function(req, res){
    console.log(req.body)
    let data = {
        'description': req.body.description,
        'food': req.body.food.split(','),
        'datetime': req.body.datetime
    }
    await axios.post(BASE_API_URL + 'sighting', data)
    res.redirect('/')
})

app.get('/:sighting_id/update', async function(req, res){
    let foodSightingId = req.params.sighting_id

    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId)
    let foodSighting = response.data

    res.render('edit_food_form', {
        'description': foodSighting.description,
        'food': foodSighting.food,
        'datetime': foodSighting.datetime.slice(0, -1) 
    })
})

app.post('/:sighting_id/update', async function(req,res){
    let description = req.body.description;
    let food = req.body.food.split(',');
    let datetime = req.body.datetime
    
    let sightingId = req.params.sighting_id

    let payload = {
        'description': description,
        'food': food,
        'datetime': datetime
    }

    await axios.put(BASE_API_URL + 'sighting/' + sightingId, payload)

    res.redirect('/')
})


app.get('/:sighting_id/delete', async function(req, res){
    // id for sighting document to delete
    let sightingId = req.params.sighting_id;

    // details of sighting to delete
    let response = await axios.get(BASE_API_URL + 'sighting/' + sightingId)
    let foodSighting = response.data

    // Render a form to ask if user really want to delete sighting 
    res.render('confirm_delete',{
        'foodSighting': foodSighting, 
        'description': foodSighting.description,
        'datetime': foodSighting.datetime
    })
})

app.post('/:sighting_id/delete', async function(req, res){
    await axios.delete(BASE_API_URL + 'sighting/' + req.params.sighting_id)
    res.redirect('/')
})

app.listen(3000, function(){
    console.log('server started')
})