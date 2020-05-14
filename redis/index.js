const REDIS_PORT = process.env.PORT || 6379;

module.exports = require('redis').createClient(REDIS_PORT);