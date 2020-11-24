require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const movies = require('./moviedex.js');

app.use(cors());
app.use(morgan("combined"));
app.use(helmet());

const API_TOKEN = process.env.API_TOKEN;
const validateBearerToken = function(req, res, next) {
  const authVal = req.get('Authorization') || '';
  if(!authVal.startsWith('Bearer ')) {
    return res.status(400).json({message: 'Must include Bearer token'})
  }
  const token = authVal.split(' ')[1];
  if(token !== API_TOKEN) {
    return res.status(401).json({message: 'Must include Bearer token'})
  }
  next();
}
app.use(validateBearerToken)

const handleGetAllMovies = function(req, res) {
  res.json({ movies });
}
const handleGetMoviesByCountry = function(req, res) {
  const country = req.query.country.toLowerCase();
  let movieByCountry = movies.filter(movie => movie.country.toLowerCase().includes(country));
  res.json(movieByCountry);
}
const handleGetMoviesByGenre = function(req, res) {
  const genre = req.query.genre.toLowerCase();


  let filteredMovies = movies.filter(movie => movie.genre.toLowerCase().includes(genre) );
  res.json({filteredMovies});
}

const handleGetMovies = function(req, res) {
  const genre = req.query.genre;
  const country = req.query.country
  
  if(country) {
    return handleGetMoviesByCountry(req, res);
  }
  if(genre) {
    return handleGetMoviesByGenre(req, res);
  }
  else { return handleGetAllMovies(req, res);}
}
app.get('/movies', handleGetMovies)


app.listen(8080, () => {
  console.log('server is running on port 8080');
})