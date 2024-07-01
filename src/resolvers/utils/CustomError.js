export class CustomError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'CustomError';
        this.originalError = originalError;
    }
}
