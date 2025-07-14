import z from 'zod'

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
    return schema.parse(body)
}

// Validate request params
export function validateParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
    return schema.parse(params)
}

// Validate request query
export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): T {
    return schema.parse(query)
}
