const Hapi = require('hapi');

(async () => {
  try {
    const server = Hapi.server({
      port: Number(process.argv[2] || 8080)
    });

    server.route({
      path: '/users/{userId}',
      method: 'GET',
      handler: (request, h) => {
        return `Hello ${request.params.userId}`;
      }
    })

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.log(err)
  }
})();