export interface IExportOption {
    extension: string;
    url: string;
}

export interface IExportOptions {
    pdf: IExportOption;
    excel: IExportOption;
    name: string;
}
