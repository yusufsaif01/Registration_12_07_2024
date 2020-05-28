const Promise = require('bluebird');
const client = Promise.promisifyAll(require("./index"))

class RedisService {
    async getUserFromCacheByKey(key) {
        try {
            let result = await client.getAsync(key);
            result = JSON.parse(result)
            return result;
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    async getUserIdFromCacheByKey(key) {
        try {
            let result = await client.getAsync(key);
            return result;
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }
}

module.exports = new RedisService();

