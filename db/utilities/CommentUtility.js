const CommentSchema = require("../schemas/CommentSchema");
const BaseUtility = require("./BaseUtility");

class CommentUtility extends BaseUtility {
    constructor() {
        super(CommentSchema);
    }
}

module.exports = CommentUtility;