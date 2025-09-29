import * as z from "zod/mini"

export const PIDDataSchema = z.object({
    identifier: z.string(),
    name: z.string(),
    description: z.optional(z.string())
})

export type PIDData = z.infer<typeof PIDDataSchema>
