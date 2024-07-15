export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
}