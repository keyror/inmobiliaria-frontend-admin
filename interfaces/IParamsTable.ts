import type {SortType} from "vue3-easy-data-table";

export interface IParamsTable {
    page: number;
    perPage: number;
    sortBy?: string | string[];
    sortType?: SortType | SortType[];
    search?: string;
}
