const axios = require("axios");
require('dotenv').config({ path: __dirname + '/../.env' });

class APIService {
    async executeAPI(url = "", method = "GET", data = {}) {
        try {
            let host = process.env.MASTER_DATA_HOST;
            url = host + url;

            let response = await axios({
                method: method,
                url: url,
                data: data
            });
            if (response && response.data) {
                return response.data;
            }
            return response;
        } catch (err) {
            console.log("Error in executing API", err);
            throw err;
        }
    }
}

module.exports = APIService;