const Hapi = require('hapi');
const Http2 = require('http2');
const fs = require('fs');

const serverOptions = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  allowHTTP1: true
};

(async () => {
  try {
    const server = Hapi.server({
      listener: Http2.createSecureServer(serverOptions),
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
