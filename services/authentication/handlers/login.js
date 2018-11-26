const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = `${__dirname}../../../grpc/protos/auth.proto`;
const REMOTE_SERVER = "localhost.grpc:5001";

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

const getDataViagRPC = () => new Promise((resolve, reject) => {
  client.login({username: 'user', password: 'password'}, (err, response) => {
    if (!response.err) {
      resolve(response);
    } else {
      reject(err);
    }
  });
});


module.exports = async (request, h) => {
  console.log('login-service');
  const allResults = await getDataViagRPC();
  return h.response(allResults);
}