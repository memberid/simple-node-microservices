# Simple Microservices with Docker, NGINX, Node.js & gRPC 

Cara menjalankan:
```console
docker-compose up --build
```
Perintah di atas akan secara otomatis menjalankan script `docker-compose.yml` yang berisi definisi semua server, service, dan package yang diperlukan.

Karena method post semua end point `GET`, untuk mencoba end point, buka saja end point berikut:
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
4. Inbox service (Node.js)
5. Users service (Node.js)
6. Authentication service (Node.js)
7. Authentication service Load-balancer (Nginx)


## Reverse Proxy
Digunakan untuk meneruskan konten dari beberapa client ke server lain. Keterangan lebih lengkap: [lihat link berikut](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

## API-gateway
Digunakan sebagai entry point tunggal untuk semua clients. Bisa juga digunakan untuk menggabungkan & mengolah lagi dua atau lebih service yang berbeda. Keterangan lebih lengkap: [lihat link berikut](https://microservices.io/patterns/apigateway.html). Karena ada kemungkinan mendapatkan trafic yang tinggi, API-gateway ini bisa ditambakna load-balancer. 

## gRPC server
Bisa digunakan untuk komunikasi antar-service atau dari client langsung ke gRPC server. Keterangan lebih lengkap: [lihat link berikut](https://itnext.io/effectively-communicate-between-microservices-de7252ba2f3c)

## Inbox service
Microservice sederhana untuk menangani `GET` request dengan end-point `/inbox`.
Serive ini berjalan di port `3200`

## Users service 
Microservice sederhana untuk menangani `GET` request dengan end-point `/users/{userId}`. Service ini berjalan di port `3300`

## Authentication service
Microservice ini terdiri dari 2 end-point. `/authentication` & `/login`. Service ini berjalan di port `4100`. `/authentication` hanya menampilkan teks dg cara sederhana. Sedang endpoint `/login` menampilkan teks yang diperoleh dari gRPC server.

## Authentitation Load Balancer
Karena ada kemungkinan mendapatkan trafic yang tinggi, pada service ini ditambakan load-balancer (nginx) yang berjalan di port `4100`

