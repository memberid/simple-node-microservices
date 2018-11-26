const Hapi = require('hapi');

(async () => {
  try {
    const server = Hapi.server({
      port: Number(process.argv[2] || 8080)
    });

    await server.register({ plugin: require('h2o2') });

    server.route([
      {
        path: '/authentication',
        method: 'GET',
        handler: {
          proxy: {
            host: 'localhost.nginx',    // auth service nginx load balancer host
            port: '4100',               // auth service nginx load balancer port
          }
        }
      }, 
      {
        path: '/login',
        method: 'GET',
        handler: {
          proxy: {
            uri: `http://localhost.nginx:4100/login` // using gRPC
          }
        }
      }, 
      {
        path: '/inbox',
        method: 'GET',
        handler: {
          proxy: {
            host: 'inbox',              // inbox service host (not using nginx load balancer)
            port: '3200',               // inbox service port (not using nginx load balancer)
          }
        }
      },
      {
        path: '/users/{userId}',
        method: 'GET',
        handler: {
          proxy: {
            uri: `http://users:3300/users/{userId}`
          }
        }
      }
    ]);

    await server.start()
    console.log('api-gateway running at:', server.info.uri);
  } catch (err) {
    console.log(err)
  }
})();