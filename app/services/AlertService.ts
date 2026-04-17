// src/services/AlertService.ts
import Swal from "sweetalert2";

import type { SweetAlertResult } from "sweetalert2";

const CONFIRM_BUTTON_COLOR = "#ff5c41";
const CANCEL_BUTTON_COLOR = "#d2d2d2";

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
      confirmButtonColor: CONFIRM_BUTTON_COLOR,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        container: "swal2-custom-z-index",
      },
    });
  }

  public async showError(
    title: string,
    errors: any,
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      icon: "error",
      title: title,
      confirmButtonText: "OK",
      confirmButtonColor: CONFIRM_BUTTON_COLOR,
      html: this.leerErroresDeValidacion(errors),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        container: "swal2-custom-z-index",
      },
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
      confirmButtonColor: CONFIRM_BUTTON_COLOR,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        container: "swal2-custom-z-index",
      },
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
      confirmButtonColor: CONFIRM_BUTTON_COLOR,
      cancelButtonText: "No",
      cancelButtonColor: CANCEL_BUTTON_COLOR,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        container: "swal2-custom-z-index",
      },
    });

    //alertaService.showConfirmation('', '').then( (result) => {
    //  if (result.isConfirmed) {
    //  }
    //});
  }

  private leerErroresDeValidacion(errors: any): string {
    if (errors.response) {
      const { message } = errors.response.data;
      if (Array.isArray(message)) {
        return message.map((msg) => `* ${msg}`).join("<br>");
      }
      return message || "";
    }
    return errors || "";
  }

  public async showFormError(): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: "error",
      title: "Errores en el formulario",
      text: "Revisa los campos antes de continuar.",
      confirmButtonText: "OK",
      confirmButtonColor: CONFIRM_BUTTON_COLOR,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        container: "swal2-custom-z-index",
      },
    });
  }
}

export default new AlertService();
