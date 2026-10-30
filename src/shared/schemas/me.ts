import { z } from 'zod'

/** The signed-in person. Phase 3: the Worker reads the email from Cloudflare Access. */
export const me = z.object({ name: z.string(), email: z.string() })

export type Me = z.infer<typeof me>
