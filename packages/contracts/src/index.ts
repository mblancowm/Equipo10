import { z } from 'zod'

const nonEmptyStringSchema = z.string().trim().min(1)

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
})

export const candidateProfileSchema = z.object({
  candidateId: nonEmptyStringSchema,
  sourceChannel: nonEmptyStringSchema,
  skills: z.array(nonEmptyStringSchema).optional(),
})

export const roleApplicationSchema = z.object({
  applicationId: nonEmptyStringSchema,
  candidateId: nonEmptyStringSchema,
  role: nonEmptyStringSchema,
  stage: nonEmptyStringSchema,
  outcome: nonEmptyStringSchema.nullable(),
  updatedAt: z.iso.datetime(),
})

export const roleApplicationWithCandidateProfileSchema =
  roleApplicationSchema.extend({
    candidateProfile: candidateProfileSchema,
  })

export const candidateProfileParamsSchema = z.object({
  candidateId: nonEmptyStringSchema,
})

export const roleApplicationsQuerySchema = z.object({
  role: nonEmptyStringSchema.optional(),
  stage: nonEmptyStringSchema.optional(),
})

export const createRoleApplicationRequestSchema = z.object({
  candidateId: nonEmptyStringSchema,
  role: nonEmptyStringSchema,
  stage: nonEmptyStringSchema,
})

export const updateRoleApplicationParamsSchema = z.object({
  applicationId: nonEmptyStringSchema,
})

export const updateRoleApplicationRequestSchema = z
  .object({
    stage: nonEmptyStringSchema.optional(),
    outcome: nonEmptyStringSchema.nullable().optional(),
  })
  .refine((value) => value.stage !== undefined || value.outcome !== undefined, {
    message: 'At least one of stage or outcome must be provided',
  })

export const candidateProfileResponseSchema = z.object({
  data: candidateProfileSchema,
})

export const roleApplicationsResponseSchema = z.object({
  data: z.array(roleApplicationWithCandidateProfileSchema),
})

export const roleApplicationResponseSchema = z.object({
  data: roleApplicationSchema,
})

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'INTERNAL_ERROR']),
    message: nonEmptyStringSchema,
    issues: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: nonEmptyStringSchema,
        }),
      )
      .optional(),
  }),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
export type CandidateProfile = z.infer<typeof candidateProfileSchema>
export type RoleApplication = z.infer<typeof roleApplicationSchema>
export type RoleApplicationWithCandidateProfile = z.infer<
  typeof roleApplicationWithCandidateProfileSchema
>
export type CandidateProfileParams = z.infer<
  typeof candidateProfileParamsSchema
>
export type RoleApplicationsQuery = z.infer<typeof roleApplicationsQuerySchema>
export type CreateRoleApplicationRequest = z.infer<
  typeof createRoleApplicationRequestSchema
>
export type UpdateRoleApplicationParams = z.infer<
  typeof updateRoleApplicationParamsSchema
>
export type UpdateRoleApplicationRequest = z.infer<
  typeof updateRoleApplicationRequestSchema
>
export type CandidateProfileResponse = z.infer<
  typeof candidateProfileResponseSchema
>
export type RoleApplicationsResponse = z.infer<
  typeof roleApplicationsResponseSchema
>
export type RoleApplicationResponse = z.infer<
  typeof roleApplicationResponseSchema
>
export type ApiError = z.infer<typeof apiErrorSchema>
