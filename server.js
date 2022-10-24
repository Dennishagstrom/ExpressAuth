const express = require('express');
const app = express();
const userRoute = require('./src/Routes/User');
const userTodo = require('./src/Routes/Todo');
require('dotenv').config();

const port = process.env.PORT;

app.use('/auth', userRoute);
app.use('/todos', userTodo);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));