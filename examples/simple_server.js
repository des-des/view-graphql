const hapi = require('hapi')
const inert = require('inert')
const path = require('path')
const hapiBrowserify = require('hapi-browserify')

const server = new hapi.Server()

server.connection({
  port: '4000',
  routes: {
    files: {
      relativeTo: __dirname
    }
  }
})

server.register([inert, { register: hapiBrowserify }], err => {
  if (err) throw err
})

server.route([
  // {
  //   method: 'GET',
  //   path: '/hn.js',
  //   handler: {
  //     browserify: {
  //       path: './hn.js'
  //     }
  //   }
  // },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  }
])

server.start(err => {
  if (err) throw err

  console.log(`server listening on port ${server.info.port}`);
})
