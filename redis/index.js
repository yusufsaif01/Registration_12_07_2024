const config = require("../config");
module.exports = require('redis').createClient(config.redis.port);