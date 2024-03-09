import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { corsOptions } from './config/corsOptions.js'
import routes from './routes/routes.js'

// Constants
const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || 'production'
const DB_CONNECT = process.env.DB_CONNECT || 'mongodb://localhost:27017/cs333'

// Initialize Express
const app = express()

// Middleware
// app.use(cors(corsOptions))
app.use(express.json())

// Initialize DB
mongoose.Promise = global.Promise
mongoose
  .connect(DB_CONNECT, {
    socketTimeoutMS: 360000,
  })
  .then(() => {
    console.info(`MongoDB connected`)
  })
  .catch((err) => {
    console.error('Mongo Connection Error', err) 
  })

// Routes
app.use(routes)

// Start server
const server = app.listen(PORT, () => {
  console.info(`Server running on port ${PORT} in ${ENV} environment`)
})

export { app as default, server }
