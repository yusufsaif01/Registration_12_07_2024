const config = require("../config");
let redisUrl = `redis://${config.redis.host}:${config.redis.port}`;
console.log(redisUrl);
module.exports = require('redis').createClient(redisUrl);