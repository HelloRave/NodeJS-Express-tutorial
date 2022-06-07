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
    'extended': false // extended true if processing complicated forms
}))

const BASE_API_URL = 'https://ckx-movies-api.herokuapp.com/'

app.get('/', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'movies')
    // res.send(response.data)
    res.render('index', {
        'movies': response.data
    })
})

app.get('/movie/create', function(req, res){
    // res.send('hello world')
    res.render('create-movie')
})

app.post('/movie/create', async function(req, res){
    console.log(req.body)
    let newMovie = {
        'title': req.body.title,
        'plot': req.body.plot
    }
    await axios.post(BASE_API_URL + 'movie/create', newMovie);
    res.redirect('/')
})

app.get('/movie/update/:movie_id', async function(req, res){
    let movieId = req.params.movie_id;
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId)
    let movieDetail = response.data
    // console.log(response.data)
    res.render('update-movie', {
        'movieDetail': movieDetail
    })
})

app.post('/movie/update/:movie_id', async function(req, res){
    await axios.patch(BASE_API_URL + 'movie/' + req.params.movie_id, {
        'title': req.body.title,
        'plot': req.body.plot
    })
    res.redirect('/')
})

app.get('/movie/delete/:movie_id', async function(req, res){
    let movieId = req.params.movie_id; 
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId)
    let movieDetails = response.data
    res.render('delete-movie', {
        'movieDetails': movieDetails
    })
})

app.post('/movie/delete/:movie_id', async function(req, res){
    await axios.delete(BASE_API_URL + 'movie/' + req.params.movie_id)
    res.redirect('/')
})

app.listen(3000, function(){
    console.log('server started')
})