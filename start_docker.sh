docker build -t yftchain-middleware .
docker run -d --name yftchain-middleware --env-file .env-docker -v /var/www/yftchain-middleware/logs/:/usr/src/app/logs/ -p 3001:3000 --net=host yftchain-middleware 
