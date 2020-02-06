const path = require('path')

module.exports = (app) => {
  const expressSwagger = require('express-swagger-generator')(app)
  const swaggerConfig = {
    swaggerDefinition: {
      info: {
        title: 'Focus API Docs',
        description: 'Focus 后端开发接口',
        version: '1.0.0'
      },
      basePath: '/api',
      produces: ['application/json'],
      schemes: ['http'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: ''
        }
      }
    },
    basedir: path.join(__dirname, '..'),
    files: [path.join(__dirname, '../routes/api/*.js')]
  }
  expressSwagger(swaggerConfig)
}
