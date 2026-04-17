import AlertService from "~/services/AlertService";

export const useApiHandler = () => {
  const run = async <T>(
    promise: Promise<T>,
    options?: {
      setErrors?: (errors: Record<string, string>) => void;
      showSuccess?: boolean;
      successMessage?: string;
    },
  ): Promise<T | null> => {
    try {
      const response = await promise;

      if (options?.showSuccess) {
        await AlertService.showSuccess(
          "Operación exitosa",
          (response as any)?.message ?? options.successMessage,
        );
      }

      return response;
    } catch (error: any) {
      // VALIDACIÓN
      if (error instanceof ApiError && error.errors && options?.setErrors) {
        const formattedErrors: Record<string, string> = Object.fromEntries(
          Object.entries(error.errors).map(([field, messages]) => [
            field,
            (messages as string[])?.[0] ?? "",
          ]),
        );

        options.setErrors(formattedErrors);
        return null;
      }

      // ERROR NORMAL
      await AlertService.showError(
        "Ha ocurrido un error",
        error.message ?? error,
      );

      return null;
    }
  };

  return { run };
};
