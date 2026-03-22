export interface IPublishChannel {
    channel_id: string | null;
    external_link: string | null;
    status_id: string | null; // viene de lookup Si/No
    published_at: string | null;
    unpublished_at: string | null;
}
