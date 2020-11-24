require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(cors())
app.use(morgan("combined"));
app.use(helmet())

const API_TOKEN = process.env.API_TOKEN;
const validateBearerToken = () => {
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
app.get('/movies', (req, res) => {

})



app.listen(8080, () => {
  console.log('server is running on port 8080');
})