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
  return({ movies });
}

const handleGetMoviesByAvgVote = function(req, res) {
  const avgVote = parseFloat(req.query.avg_vote);

  if(Number.isNaN(avgVote)){
    return res.status(400).json({message: `Average vote should be a number`})
  } 
  let movieByAvgVote = movies.filter(movie => movie.avg_vote >= avgVote);
  if(avgVote && movieByAvgVote.length === 0) {
    res.status(404).json({ message: `Couldn't find any movies with that average vote or higher. Average vote is a range from 1 - 10`})
  } else {
    return(movieByAvgVote);
  }
}

const handleGetMoviesByCountry = function(req, res) {
  const country = req.query.country.toLowerCase();
  let movieByCountry = movies.filter(movie => movie.country.toLowerCase().includes(country));

  if(country && movieByCountry.length === 0) {
    res.status(404).json({message: `Couldn't find any movies from matching countries. Try another one.`})} else {
      return(movieByCountry);
    }

}

const handleGetMoviesByGenre = function(req, res) {
  const genre = req.query.genre.toLowerCase();
  let filteredMovies = movies.filter(movie => movie.genre.toLowerCase().includes(genre) );

  if(genre && filteredMovies.length === 0) {
    res.status(404).json({message: `Couldn't find any movies with matching genres. Try another one.`})
  } else {
    return(filteredMovies);
  }
}

const handleFilteringMovies = function(req, res) {
  const genre = req.query.genre.toLowerCase() || ''; 
  const country = req.query.country.toLowerCase() || '';
  const avg_vote = parseFloat(req.query.avg_vote) || '';
  let filteredMovies;
   if(Number.isNaN(avg_vote)){
    return res.status(400).json({message: `Average vote should be a number`})
  } 

  if(genre && avg_vote && country) {
    let genreMovies = handleGetMoviesByGenre(req, res);
    
    let firstFilteredMovies = genreMovies.filter(movie => movie.avg_vote >= avg_vote);
    filteredMovies = firstFilteredMovies.filter(movie => movie.country.toLowerCase().includes(country));
  } else if(genre && avg_vote) {
    let genreMovies = handleGetMoviesByGenre(req, res);
    
    filteredMovies = genreMovies.filter(movie => movie.avg_vote >= avg_vote);
  } else if(genre && country) {
    let genreMovies = handleGetMoviesByGenre(req, res);

    filteredMovies = genreMovies.filter(movie => movie.country.toLowerCase().includes(country));
  } else if(country && avg_vote) {
    let countryMovies = handleGetMoviesByCountry(req, res);

    filteredMovies = countryMovies.filter(movie => movie.avg_vote >= avg_vote);
  }
  if(filteredMovies.length === 0) {
    res.status(404).json({ message: `Couldn't find any matching movies`})
  } else {
    return filteredMovies;
  }
  
}

const handleGetMovies = function(req, res) {
 
  const { genre, country, avg_vote } = req.query;
  
  if((genre && country && avg_vote) || (genre && country) || (genre && avg_vote) || (country && avg_vote)) {
    res.json(handleFilteringMovies(req, res));
  } else if(avg_vote) {
    res.json(handleGetMoviesByAvgVote(req, res));
  } else if(country) {
    res.json(handleGetMoviesByCountry(req, res));
  }else if(genre) {
    res.json(handleGetMoviesByGenre(req, res));
  }
  else { res.json(handleGetAllMovies(req, res));}
}
app.get('/movies', handleGetMovies)


app.listen(8080, () => {
  console.log('server is running on port 8080');
})