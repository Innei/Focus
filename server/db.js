const mongoose = require('mongoose')

mongoose
  .connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/Focus', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(
    () => {
      console.log('Connected to db, ready...\nServer is started.')
    },
    (err) => {
      console.log(err)

      console.log('Failed to connect to db. Try again.')
    }
  )
