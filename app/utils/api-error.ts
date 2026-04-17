export class ApiError extends Error {
  public errors?: Record<string, string[]>;
  public status?: number;

  constructor(
    message: string,
    errors?: Record<string, string[]>,
    status?: number,
  ) {
    super(message);

    this.name = "ApiError";
    this.errors = errors;
    this.status = status;
  }

  override toString() {
    return this.message;
  }
}
