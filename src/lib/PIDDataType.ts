import { z } from "zod"

export const PIDDataSchema = z.object({
    identifier: z.string(),
    name: z.string(),
    description: z.string().optional()
})

export type PIDData = z.infer<typeof PIDDataSchema>
