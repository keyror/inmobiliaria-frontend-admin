// src/services/AlertService.ts
import Swal from 'sweetalert2';
import type {SweetAlertResult} from 'sweetalert2';

class AlertService {
    public async showSuccess(title: string, text?: string): Promise<SweetAlertResult>  {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#DBD6EA',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
    }

    public async showError(title :string, errors :any): Promise<SweetAlertResult>  {
        return await Swal.fire({
            icon: 'error',
            title: title,
            confirmButtonText: 'OK',
            confirmButtonColor: '#DBD6EA',
            html: this.leerErroresDeValidacion(errors),
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
    }

    public async showWarning(title: string, text?: string): Promise<SweetAlertResult>  {
        return await Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#DBD6EA',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'swal2-custom-z-index'
            }
        });
    }

    public async showConfirmation(title: string, text?: string) :Promise<SweetAlertResult> {
        return await Swal.fire({
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: '#DBD6EA',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'swal2-custom-z-index'
            }
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
                return message.map(msg => `* ${msg}`).join('<br>');
            }
            return message || '';
        }
        return errors || '';
    }

}

export default new AlertService();
