import { z } from 'zod'

export const publishChannelFormSchema = z.object({
    publish_channels: z.array(
        z.object({
            channel_id: z.string().min(1, 'El canal es obligatorio'),

            external_link: z
                .string()
                .optional()
                .nullable(),

            status_id: z.string().min(1, 'El estado es obligatorio'),

            published_at: z.string().optional().nullable(),

            unpublished_at: z.string().optional().nullable(),
        })
    )
        .min(1, 'Debe agregar al menos un canal')
})
