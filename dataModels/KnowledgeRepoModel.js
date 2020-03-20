
class KnowledgeRepoModel {
    constructor(obj) {
        Object.assign(this, obj);
    }

    get Language() {
        return this.language;
    }

    get Title() {
        return this.title;
    }

}

module.exports = KnowledgeRepoModel;