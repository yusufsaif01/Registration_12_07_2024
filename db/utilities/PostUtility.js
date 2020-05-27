const PostSchema = require("../schemas/PostSchema");
const BaseUtility = require("./BaseUtility");

class PostUtility extends BaseUtility {
    constructor() {
        super(PostSchema);
    }
}

module.exports = PostUtility;