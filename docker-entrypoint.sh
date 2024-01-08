## docker-entrypoint.sh for node.js

echo "wait db server"
dockerize -wait tcp://mariadb:3306 -timeout 10s

echo "start node server"
npm run dev