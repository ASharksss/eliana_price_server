require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./db')
const models = require('./models/models')
const router = require("./routes");

const app = express()
const originAccess = process.env.originAccess || '["http://localhost:3000"]'
app.use(cors({
  credentials: true, origin: JSON.parse(originAccess),
  allowedHeaders: ['Content-Type', 'Authorization', 'x-position'], methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE']
}))
app.use(cookieParser())
// app.use(passport.initialize())
app.use(express.json())
app.use('/api', router)
app.use('/static', express.static('static'))


const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync().then(result => {
      console.log(result)
    }).catch(e => console.log(e))
    app.listen(5001, () => {
      console.log('Port started')
    })
  } catch (e) {
    console.log(e)
  }
}

start()