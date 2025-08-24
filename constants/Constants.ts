export class Constants {
    static readonly PDF: string = "pdf";
    static readonly EXCEL: string = "xlsx";
}

export function getUrl(urlDB: string): string {
    const config = useRuntimeConfig();
    return `${config.public.apiBase}storage/${urlDB}`;
}
