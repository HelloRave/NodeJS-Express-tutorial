const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'))

wax.on(hbs.handlebars);
wax.setLayoutPath('views/layouts');

// Set up express to process forms 
app.use(express.urlencoded({
    'extended': false // extended true if processing complicated forms
}))

app.get('/', function(req, res){
    res.send('Hello world')
})

app.get('/add-food', function(req, res){
    res.render('add')
})

app.post('/add-food', function(req, res){
    console.log(req.body); //name of input is the key of the req.body object 
    let food = req.body.foodName;
    let meal = req.body.meal;
    let tags = req.body.tags;

    // tags = Array.isArray(tags)? tags : tags? [tags] : []
    tags = tags || [];
    tags = Array.isArray(tags) ? tags : [tags];

    res.render('result', {
        'food': food,
        'meal': meal,
        'tags': tags
    })
})

app.listen(3000, function(){
    console.log('server started')
})