const Hapi = require('hapi');

(async () => {
  try {
    const server = Hapi.server({
      port: Number(process.argv[2] || 8080)
    });

    await server.register({ plugin: require('h2o2') });

    server.route({
      path: '/auth',
      method: 'GET',
      handler: {
        proxy: {
          host: 'nginx',
          port: '4100',
        }
      }
    })

    await server.start()
    console.log('api-gateway running at:', server.info.uri);
  } catch (err) {
    console.log(err)
  }
})();