docker rm -f yftchain-middleware
docker build -t yftchain-middleware .
docker run -d --name yftchain-middleware --env-file ../.env-docker -v /var/www/yftchain-middleware/logs/:/usr/src/app/logs/ -v /var/www/yftchain-middleware/uploads/documents/:/usr/src/app/uploads/documents/ -p 3001:3000 --net=host yftchain-middleware 
