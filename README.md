# Simple Microservices with Docker, NGINX, Node.js & gRPC 

Cara menjalankan:
```console
docker-compose up --build
```

Method post semua end point `GET`. Untuk mencoba end point, buka saja end point berikut
1. `http://localhost/authentication`
2. `http://localhost/login`
3. `http://localhost/inbox`
4. `http://localhost/users`

# Penjelasan

![Microservices](https://github.com/ynwd/simple-node-microservices/blob/master/docs/microservices.svg "Microservices")

Aplikasi ini terdiri dari 
1. Reverse Proxy (Nginx)
2. API-Gateway (Node.js)
3. gRPC server (Node.js)
4. Authentication service (Node.js)
5. Authentication service Load-balancer (Nginx)
6. Inbox service (Node.js)
7. Users service (Node.js)

## Reverse Proxy
Digunakan untuk meneruskan konten dari beberapa client ke server lain. Keterangan lebih lengkap [lihat link berikut](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

