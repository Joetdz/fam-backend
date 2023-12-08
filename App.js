const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const userRouter = require('./routes/user')
const frameRouter = require('./routes/frame')
const payementRouter = require('./routes/payement')
dotenv.config()
const corsOption = {
  origin: '*',
}
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT
app.get('/', (req, res) => res.send('Hello from the backend'))
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log('connecter à Mongo Db'))
  .catch((error) => console.log(error))

app.use(express.json())
app.use('/user', userRouter)
app.use('/frame', frameRouter)
app.use('/payement', payementRouter)
app.listen(port, () => {
  console.log('Server is running on port ', port)
})

module.exports = app
