export interface ImageItem {
    tempId?: string
    id?: string | null
    url: string
    is_cover: boolean
    loading?: boolean
    error?: boolean
    uploading?: boolean,
    imageLoading?: boolean,
    deleting?: boolean,
    settingCover?: boolean
}

export interface IImage {
    id?: string  | null
    imageable_id?: string
    imageable_type?: string
    image_type_id?: string | null
    title?: string | null
    description?: string | null
    file_name?: string
    file_path?: string
    file_extension?: string
    mime_type?: string
    file_size?: number
    disk?: string
    width?: number | null
    height?: number | null
    sort_order?: number
    is_cover?: boolean
    is_public?: number | boolean
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
    url: string
}

export interface IImagePayload {
    id?: string | null
    url: string
    is_cover: boolean
    sort_order: number
}
