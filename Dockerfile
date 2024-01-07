FROM node:20.10

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install --save fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]