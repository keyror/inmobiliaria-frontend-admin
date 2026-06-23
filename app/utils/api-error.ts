export class ApiError extends Error {
  public errors?: Record<string, string[]>;
  public status?: number;
  public requiredPermissions?: string[];

  constructor(
    message: string,
    errors?: Record<string, string[]>,
    status?: number,
    requiredPermissions?: string[],
  ) {
    super(message);

    this.name = "ApiError";
    this.errors = errors;
    this.status = status;
    this.requiredPermissions = requiredPermissions;
  }

  override toString() {
    return this.message;
  }
}
