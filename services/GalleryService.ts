import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class GalleryService {

    async uploadSingle(formData: FormData): Promise<any> {
        return useApi(ApiUrls.IMAGES, {
            method: 'POST',
            body: formData
        });
    }

    async deleteImage(id: string): Promise<any> {
        return useApi(`${ApiUrls.IMAGES}/${id}`, {
            method: 'DELETE'
        });
    }

    async setCover(id: string): Promise<any> {
        return useApi(`${ApiUrls.IMAGES}/${id}/${ApiUrls.IMAGE_COVER}`, {
            method: 'PATCH'
        });
    }
}

export default new GalleryService();
