class HttpError extends Error {
    private errorCode: number;
    constructor(message: string, errorCode: number) {
        super(message);
        this.errorCode = errorCode;
    }
}

export default HttpError;