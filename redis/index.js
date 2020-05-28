const config = require("../config");
let redisUrl = `redis://${config.redis.host}:${config.redis.port}`;
const Promise = require('bluebird');

function connectRedis() {
    try {
        const redisClient = Promise.promisifyAll(require('redis').createClient(redisUrl));
        console.log(redisUrl);
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