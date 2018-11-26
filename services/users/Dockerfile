FROM node:carbon
RUN apt-get update -y && apt-get install apt-utils -y && apt-get install nasm -y
WORKDIR /code
COPY package.json .
RUN npm install