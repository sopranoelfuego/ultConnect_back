class ErrorResponse extends Error {

    constructor(message,statuCode){
        super(message),
        this.statuCode=statuCode
        this.message=message
    }

}
module.exports =ErrorResponse