# Simple Microservices with Docker, NGINX, Node.js & gRPC 

Sebelum menjalankan aplikasi microservices ini, pastikan kamu sudah install docker pada sistem. Keterangan lebih lengkap lihat [link berikut](https://docs.docker.com/install/)

Cara menjalankan:
```console
docker-compose up --build
```
Perintah di atas akan secara otomatis menjalankan script `docker-compose.yml` yang berisi definisi semua server, service, dan package yang diperlukan.

Karena method semua end point adalah `GET`, untuk mencobanya, buka saja end point berikut:
1. `http://localhost/authentication`
2. `http://localhost/login`
3. `http://localhost/inbox`
4. `http://localhost/users`

# Penjelasan

Mari kita lihat diagram sederhana microservice berikut.

![Microservices](https://github.com/ynwd/simple-node-microservices/blob/master/docs/microservices.svg "Microservices")

Aplikasi ini terdiri dari 
1. [Reverse Proxy](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#reverse-proxy)
2. [API-Gateway](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#api-gateway)
3. [gRPC server](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#grpc-server)
4. [Inbox service](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#inbox-service)
5. [Users service](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#users-service)
6. [Authentication service](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#authentication-service)
7. [Authentication service Load-balancer](https://github.com/ynwd/simple-node-microservices/blob/master/README.md#authentitation-load-balancer)


### Reverse Proxy
Digunakan untuk meneruskan konten dari beberapa client ke server lain. Keterangan lebih lengkap: [lihat link berikut](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

### API-gateway
Digunakan sebagai entry point tunggal untuk semua clients. Bisa juga digunakan untuk menggabungkan & mengolah lagi dua atau lebih service yang berbeda. Keterangan lebih lengkap: [lihat link berikut](https://microservices.io/patterns/apigateway.html). Karena ada asumsi mendapatkan trafic yang tinggi, pada API-gateway ini ditambahkan [load-balancer](https://github.com/ynwd/simple-node-microservices/blob/master/nginx/service.auth.conf). 

```apacheconf
upstream api-gateway {
   server api-gateway1:3000; 
}

server {
    listen       80;
    server_name  localhost;

     location / {
        proxy_pass http://api-gateway;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### gRPC server
Bisa digunakan untuk komunikasi antar-service atau dari client langsung ke gRPC server. Keterangan lebih lengkap: [lihat link berikut](https://itnext.io/effectively-communicate-between-microservices-de7252ba2f3c)

```javascript
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
  callback(null, {message: 'Hello ' + call.request.username});
}

server.addService(proto.grpc.auth.Auth.service, { login: login });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();
```


### Inbox service
Microservice sederhana untuk menangani `GET` request dengan end-point `/inbox`.
Serive ini berjalan di port `3200`

```javascript
{
  path: '/inbox',
  method: 'GET',
  handler: {
    proxy: {
      host: 'inbox',             
      port: '3200'
    }
  }
}
```

### Users service 
Microservice sederhana untuk menangani `GET` request dengan end-point `/users/{userId}`. Service ini berjalan di port `3300`

```javascript
{
  path: '/users/{userId}',
  method: 'GET',
  handler: {
    proxy: {
      uri: `http://users:3300/users/{userId}`
    }
  }
}

```

### Authentication service
Microservice ini terdiri dari 2 end-point. `/authentication` & `/login`. Service ini berjalan di port `4100`. `/authentication` hanya menampilkan teks dg cara sederhana. Sedang endpoint `/login` menampilkan teks yang diperoleh dari gRPC server.

```javascript
{
  path: '/authentication',
  method: 'GET',
  handler: {
    proxy: {
      host: 'localhost.nginx'
      port: '4100'
    }
  }
}
```

### Authentitation Load Balancer
Karena ada kemungkinan mendapatkan trafic yang tinggi, pada service ini ditambakan load-balancer (nginx) yang berjalan di port `4100`

```apacheconf
upstream authentication {
   server authentication1:3100; 
   server authentication2:3101;
}

server {
    listen       4100;
    server_name  authentication;
    
    location / {
        proxy_pass http://authentication;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

