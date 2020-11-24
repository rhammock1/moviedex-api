require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const app = express();

app.use(cors())
app.use(morgan("combined"));
app.use(helmet())


app.listen(8080, () => {
  console.log('server is running on port 8080');
})