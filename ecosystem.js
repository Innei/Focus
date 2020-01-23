require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'app',
      script: 'server/build/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M'
    }
  ]
}
