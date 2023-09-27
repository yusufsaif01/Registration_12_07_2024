const errors = require("./errors");
class ResponseHandler {
    successHandler(data) {
        let response = {
            "status": "success",
            "message": "Successfully done"
        };
        if (data) {
            response.data = data;
        }
        return Promise.resolve(response);
    }

    errorHandler(data) {
        return Promise.reject(data);
    }
}

function handler(req, res, promise) {
    let _inst = new ResponseHandler();
    promise.then(_inst.successHandler).catch(_inst.errorHandler)
        .then((data) => {
            res.json(data);
        })
        .catch((data) => {
            console.log("-------getting error ------", data);
            if (data.httpCode) {
                console.log("inside the if of response !!!!!!!!!!");
                return res.status(data.httpCode).json(data);
            } else {
                console.log("inside the else of response !!!!!!!!!!");
                let error = new errors.Internal();
                return res.status(error.httpCode).json(error);
            }
        });
}

module.exports = handler;
