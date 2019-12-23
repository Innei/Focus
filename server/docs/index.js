const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
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
      produces: ['application/json', 'application/xml'],
      schemes: ['http', 'https'],
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

  // const swaggerSpec = swaggerJSDoc({
  //   definition: {
  //     // swagger 采用的 openapi 版本 不用改
  //     openapi: '3.0.0',
  //     // swagger 页面基本信息 自由发挥
  //     info: {
  //       title: 'Express Template',
  //       version: '1.0.0'
  //     }
  //   },
  //   // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
  //   apis: [path.join(__dirname, '../routes/api/*.js')]
  // })
  // console.log(path.join(__dirname, '../routes/api/*.js'))

  // app.get('/swagger.json', function(req, res) {
  //   res.setHeader('Content-Type', 'application/json')
  //   res.send(swaggerSpec)
  // })

  // // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
