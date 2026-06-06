// src/services/AlertService.ts
import Swal from "sweetalert2";

import { DEFAULT_REALSTATE_THEME } from "~/constants/RealstateTemplates";

import type { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

const CANCEL_BUTTON_COLOR = "#d2d2d2";
const CONFIRM_BUTTON_THEME_VAR = "--theme-default6";
const SAFE_BACKDROP_CLASS = "swal2-safe-backdrop";
const ALERT_CUSTOM_CLASS = {
  container: `swal2-custom-z-index ${SAFE_BACKDROP_CLASS}`,
  confirmButton: "swal2-theme-confirm-button",
  cancelButton: "swal2-theme-cancel-button",
};

const getThemeColor = (cssVariable: string, fallback: string): string => {
  if (!import.meta.client) return fallback;

  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim();

  return color || fallback;
};

const getConfirmButtonColor = (): string =>
  getThemeColor(CONFIRM_BUTTON_THEME_VAR, DEFAULT_REALSTATE_THEME.primary);

const getBaseAlertOptions = (): SweetAlertOptions => ({
  confirmButtonText: "OK",
  confirmButtonColor: getConfirmButtonColor(),
  allowOutsideClick: false,
  allowEscapeKey: false,
  backdrop: false,
  customClass: ALERT_CUSTOM_CLASS,
});

interface AlertValidationError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

const getValidationMessage = (errors: unknown): string | string[] => {
  if (typeof errors !== "object" || errors === null) return "";

  return (errors as AlertValidationError).response?.data?.message ?? "";
};

class AlertService {
  public async showSuccess(
    title: string,
    text?: string,
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      ...getBaseAlertOptions(),
      icon: "success",
      title,
      text,
    });
  }

  public async showError(
    title: string,
    errors: unknown,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...getBaseAlertOptions(),
      icon: "error",
      title: title,
      html: this.leerErroresDeValidacion(errors),
    });
  }

  public async showWarning(
    title: string,
    text?: string,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...getBaseAlertOptions(),
      icon: "warning",
      title,
      text,
    });
  }

  public async showConfirmation(
    title: string,
    text?: string,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...getBaseAlertOptions(),
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      cancelButtonColor: CANCEL_BUTTON_COLOR,
    });

    //alertaService.showConfirmation('', '').then( (result) => {
    //  if (result.isConfirmed) {
    //  }
    //});
  }

  private leerErroresDeValidacion(errors: unknown): string {
    const message = getValidationMessage(errors);

    if (Array.isArray(message)) {
      return message.map((msg) => `* ${msg}`).join("<br>");
    }

    if (message) return message;
    if (typeof errors === "string") return errors;
    if (errors instanceof Error) return errors.message;

    return "";
  }

  public async showFormError(): Promise<SweetAlertResult> {
    return Swal.fire({
      ...getBaseAlertOptions(),
      icon: "error",
      title: "Errores en el formulario",
      text: "Revisa los campos antes de continuar.",
    });
  }
}

export default new AlertService();
