FROM node:20.10-alpine

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install --save fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
RUN npm install

COPY . .

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]

CMD ["npm", "run", "dev"]