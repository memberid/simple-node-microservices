

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = `${__dirname}./../protos/auth.proto`;
const REMOTE_SERVER = "0.0.0.0:5001";

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
 
let proto = grpc.loadPackageDefinition(packageDefinition);

let client = new proto.grpc.auth.Auth(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

client.login({username: 'user', password: 'password'}, function(err, response) {
  console.log('Greeting:', response.message);
});