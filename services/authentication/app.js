const Hapi = require('hapi');

(async () => {
  try {
    const server = Hapi.server({
      port: Number(process.argv[2] || 8080)
    });

    server.route([
      {
        path: '/login',
        method: 'GET',
        handler: require('./handlers').login
      },
      {
        path: '/{name}',
        method: 'GET',
        handler: (request, h) => {
          console.log('Server running at:', server.info.uri);
          return `Hello ${request.params.name}`;
        }
      },
    ])

    await server.start()
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.log(err)
  }
})();