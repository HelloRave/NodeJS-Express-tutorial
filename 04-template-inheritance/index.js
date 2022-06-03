const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on') // provide template inheritance for hbs

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'))

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts')

app.get('/', function(req, res){
    res.render('index');
})

app.get('/about-us', function(req, res){
    res.render('about-us')
})

app.listen(3000, function(){
    console.log('server started')
})