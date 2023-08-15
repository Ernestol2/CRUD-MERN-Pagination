const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const mainRoutes = require('./src/routes/index')
const cors = require('cors')

const app = express()
require('dotenv').config()

try {
   mongoose.connect(process.env.MONGO_URI) 
   console.log('connected to mongoDB');
} catch (error) {
    console.log(error, "no se pudo conectar a la base de datos");
}

app.use(cors())
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({
    extended: true
}))


app.set('views', path.join(__dirname, 'src/views'))

app.set('view engine', 'ejs')

app.use("/api", mainRoutes);

module.exports = app; 