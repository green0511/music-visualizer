FROM node:6.3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 80
WORKDIR /usr/src/app
ENTRYPOINT ["node","bin/www"]
