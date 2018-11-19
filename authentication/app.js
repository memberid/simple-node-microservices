const Hapi = require('hapi');

(async () => {
  try {
    const server = Hapi.server({
      port: Number(process.argv[2] || 8080)
    });

    server.route({
      path: '/{name}',
      method: 'GET',
      handler: (request, h) => {
        return `Hello ${request.params.name}`;
      }
    })

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.log(err)
  }
})();