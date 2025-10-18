class SysOptResult {
    constructor(result, error, message, data) {
        this.result = result;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}

module.exports = SysOptResult;
