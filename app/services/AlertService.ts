// src/services/AlertService.ts
import Swal from "sweetalert2";

import { DEFAULT_COMPANY_THEME_COLORS } from "~/constants/CompanyTheme";

import type { SweetAlertResult } from "sweetalert2";

const CANCEL_BUTTON_COLOR = "#d2d2d2";
const CONFIRM_BUTTON_THEME_VAR = "--theme-default6";
const ALERT_CUSTOM_CLASS = {
  container: "swal2-custom-z-index",
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
  getThemeColor(CONFIRM_BUTTON_THEME_VAR, DEFAULT_COMPANY_THEME_COLORS.primary);

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
      icon: "success",
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: getConfirmButtonColor(),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: ALERT_CUSTOM_CLASS,
    });
  }

  public async showError(
    title: string,
    errors: unknown,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      icon: "error",
      title: title,
      confirmButtonText: "OK",
      confirmButtonColor: getConfirmButtonColor(),
      html: this.leerErroresDeValidacion(errors),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: ALERT_CUSTOM_CLASS,
    });
  }

  public async showWarning(
    title: string,
    text?: string,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: getConfirmButtonColor(),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: ALERT_CUSTOM_CLASS,
    });
  }

  public async showConfirmation(
    title: string,
    text?: string,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Si",
      confirmButtonColor: getConfirmButtonColor(),
      cancelButtonText: "No",
      cancelButtonColor: CANCEL_BUTTON_COLOR,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: ALERT_CUSTOM_CLASS,
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
      icon: "error",
      title: "Errores en el formulario",
      text: "Revisa los campos antes de continuar.",
      confirmButtonText: "OK",
      confirmButtonColor: getConfirmButtonColor(),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: ALERT_CUSTOM_CLASS,
    });
  }
}

export default new AlertService();
