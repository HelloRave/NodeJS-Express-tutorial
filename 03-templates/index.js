const express = require('express')

const hbs = require('hbs')

const app = express()

app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', function(req,res){
    res.render('index')
})

app.get('/hello/:firstname/:lastname', function(req,res){
    let fname = req.params.firstname;
    let lname = req.params.lastname;
    res.render('hello', {
        'firstName': fname,
        'lastName': lname
    })
})

app.listen(3000, function(){})