import type {IPropertyPrice} from "~/interfaces/IPropertyPrice";
import type {IArea} from "~/interfaces/IArea";
import type {IPublishChannel} from "~/interfaces/IPublishChannel";
import type {IPropertyObligation} from "~/interfaces/IPropertyObligation";
import type {IImage, IImagePayload} from "~/interfaces/IImageItem";

export interface IProperty {
    code: string;
    status_property_id: string;
    status_id: string;
    title: string;
    offer_type_id: string;
    property_type_id: string;
    social_strata: string;
    year_built: string;
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    garage_type_id: string;
    garage_spots: string;
    cadastral_number: string;
    url_google_map: string;
    latitude: string;
    longitude: string;
    boundaries: string;
    description: string |null |undefined;
    images?: IImage[] | IImagePayload[] ;

    status?: any;
    offer_type?: any;
    property_type?: any;
    garage_type?: any;

    areas: IArea[];
    publish_channels?: IPublishChannel[];
    features?: any[];
    obligations: IPropertyObligation[];
    price: IPropertyPrice,


}
