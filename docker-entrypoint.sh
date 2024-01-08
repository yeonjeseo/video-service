## docker-entrypoint.sh for node.js

echo "wait db server"
dockerize -wait tcp://mariadb:3306 -timeout 20s

echo "start node server"

npm install --save fluent-ffmpeg @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
npm install

npm run dev