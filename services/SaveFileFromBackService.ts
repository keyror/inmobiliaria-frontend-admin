import {Constants} from "~/constants/Constants";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {useApi} from "~/composables/useApi";

class SaveFileFromBackService {
    public async captureFile(file: Blob, typeFile: string | undefined, module:string): Promise<void> {
        const responseType = typeFile === Constants.PDF ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const ext = typeFile === Constants.PDF ? 'pdf' : 'xlsx';

        const blob = new Blob([file], { type: responseType });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = module +'_' + new Date().toLocaleDateString() + '.'+ ext;
        link.click();
    }

    async getExport(params: IParamsTable,urlExport: string): Promise<any> {
        return useApi(urlExport, {
                query: params,
                responseType: 'blob'
        });
    }

}
export default new SaveFileFromBackService;
