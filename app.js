require('dotenv').config();
const express = require('express');
const app = express();

app.use(cors())
app.use(morgan("combined"));



app.listen(8080, () => {
  console.log('server is running on port 8080');
})