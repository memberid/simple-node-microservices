const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = `${__dirname}/protos/auth.proto`;
const SERVER_ADDRESS = "localhost.grpc:5001";

const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
 
let proto = grpc.loadPackageDefinition(packageDefinition);

function login(call, callback){
  console.log('call', call)
  callback(null, {message: 'Hello ' + call.request.username});
}

server.addService(proto.grpc.auth.Auth.service, { login: login });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();