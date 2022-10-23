const express = require('express');
const app = express();
const userRoute = require('./src/Routes/User');
require('dotenv').config();

const port = process.env.PORT;

app.use('/auth', userRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));