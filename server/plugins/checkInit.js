const Option = require('../models/Option')
;(async () => {
  const r = await Option.countDocuments()
  if (!r) {
    await Option.insertMany([
      {
        name: 'createdDay',
        value: new Date()
      },
      {
        name: 'title',
        value: 'Focus'
      },
      {
        name: 'desc',
        value: 'Hello World'
      },
      {
        name: 'installed',
        value: 1
      },
      {
        name: 'AccessNumber',
        value: {
          PV: 0,
          IP: 0,
          UV: 0
        }
      },
      {
        name: 'count',
        value: {
          postCount: 0,
          momentCount: 0,
          commentCount: 0,
          noteCount: 0
        }
      },
      {
        name: 'other',
        value: {}
      }
    ])
  }
})()
