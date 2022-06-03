const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')

let app = express()
app.set('view engine', 'hbs')

app.use(express.urlencoded({
    extended: false
}))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.get('/', function(req, res){
    res.render('index')
})

app.post('/', function(req,res){
    console.log(req.body)
    let {height, weight, units} = req.body
    let bmi = Number(weight) / (Number(height) ** 2)

    units == 'si'? bmi : bmi*= 2

    res.render('result', {
        'BMI': bmi
    })
})

app.listen(3000, function(){
    console.log('server started')
})