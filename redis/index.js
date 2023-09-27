const config = require("../config");
//let redisUrl = `redis://${config.redis.host}:${config.redis.port}`;
const Promise = require('bluebird');

const cacheHostName = "dyt-radis.redis.cache.windows.net";
const cachePassword = "Cll5dptUumL6FBG6lyAxDhzbr6ybW2i3yAzCaLMK6sY=";

function connectRedis() {
    try {
        
      
        const redisClient = Promise.promisifyAll(require('redis').createClient({
            "url": `rediss://${cacheHostName}:6380`,
            "password": cachePassword
        }));
       // console.log(redisUrl);
        redisClient.on('connect', function () {
            console.log(`Connected to Redis`);
        });
        redisClient.on('error', function (err) {
            console.log('Redis error: ' + err);
        });
        return redisClient;
    } catch (e) {
        console.log(e)
    }
}
module.exports = connectRedis();