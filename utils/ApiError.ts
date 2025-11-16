export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ''; // Esto quita el prefijo “Error:”
    }

    override toString() {
        return this.message;
    }
}
