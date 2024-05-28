require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const sequelize = require('./db')
const models = require('./models/models')
const router = require("./routes");

const app = express()
app.use(cors())
app.use(cookieParser())
// app.use(passport.initialize())
app.use(express.json())
app.use('/api', router)


const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync().then(result => {
      console.log(result)
    }).catch(e => console.log(e))
    app.listen(5000, () => {
      console.log('Port started')
    })
  } catch (e) {
    console.log(e)
  }
}

start()