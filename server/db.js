const mongoose = require('mongoose')
const consola = require('consola')
mongoose
  .connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/Focus', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(
    () => {
      consola.success({ message: 'Connected to db, ready...' })
      consola.ready({ message: 'Server is started.', badge: true })
    },
    (err) => {
      consola.error(err)

      consola.error('Failed to connect to db. Try again.')
    }
  )
