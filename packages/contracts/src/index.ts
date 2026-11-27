import { z } from 'zod'

const nonEmptyStringSchema = z.string().trim().min(1)

export const stageSchema = z.enum([
  'Added to role',
  'Initial screening',
  'Screening passed',
  'Interview',
  'Final interview',
  'Decision',
])

export const outcomeSchema = z.enum([
  'Selected',
  'Not selected',
  'Withdrawn',
])

export const reuseReviewStatusSchema = z.enum([
  'Pending',
  'Approved',
  'Not approved',
])

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
})

export const candidateProfileSchema = z.object({
  candidateId: nonEmptyStringSchema,
  sourceChannel: nonEmptyStringSchema,
  skills: z.array(nonEmptyStringSchema).optional(),
})

export const stageHistoryEventSchema = z.object({
  stage: stageSchema,
  reachedAt: z.iso.datetime(),
})

export const roleApplicationSchema = z.object({
  applicationId: nonEmptyStringSchema,
  candidateId: nonEmptyStringSchema,
  role: nonEmptyStringSchema,
  department: nonEmptyStringSchema,
  stage: stageSchema,
  stageHistory: z.array(stageHistoryEventSchema).min(1),
  outcome: outcomeSchema.nullable(),
  updatedAt: z.iso.datetime(),
}).superRefine((application, context) => {
  const lastStage = application.stageHistory.at(-1)
  if (lastStage?.stage !== application.stage) {
    context.addIssue({
      code: 'custom',
      path: ['stageHistory'],
      message: 'The last stage-history event must match the current stage',
    })
  }

  for (let index = 1; index < application.stageHistory.length; index += 1) {
    if (
      Date.parse(application.stageHistory[index].reachedAt) <
      Date.parse(application.stageHistory[index - 1].reachedAt)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['stageHistory', index, 'reachedAt'],
        message: 'Stage-history timestamps must be chronological',
      })
    }
  }
})

export const futureRoleReviewSchema = z
  .object({
    reviewId: nonEmptyStringSchema,
    candidateId: nonEmptyStringSchema,
    triggeringApplicationId: nonEmptyStringSchema,
    status: reuseReviewStatusSchema,
    reviewerId: nonEmptyStringSchema.nullable(),
    reviewedAt: z.iso.datetime().nullable(),
  })
  .superRefine((review, context) => {
    const isPending = review.status === 'Pending'
    if (isPending && (review.reviewerId !== null || review.reviewedAt !== null)) {
      context.addIssue({
        code: 'custom',
        message: 'Pending reviews cannot have a reviewer or reviewedAt value',
      })
    }
    if (
      !isPending &&
      (review.reviewerId === null || review.reviewedAt === null)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'A decided review must include reviewerId and reviewedAt',
      })
    }
  })

export const roleApplicationWithCandidateProfileSchema =
  roleApplicationSchema.safeExtend({
    candidateProfile: candidateProfileSchema,
  })

export const candidateProfileParamsSchema = z.object({
  candidateId: nonEmptyStringSchema,
})

export const roleApplicationsQuerySchema = z.object({
  role: nonEmptyStringSchema.optional(),
  department: nonEmptyStringSchema.optional(),
  stage: stageSchema.optional(),
  outcome: outcomeSchema.optional(),
})

export const createRoleApplicationRequestSchema = z.object({
  candidateId: nonEmptyStringSchema,
  role: nonEmptyStringSchema,
  department: nonEmptyStringSchema,
})

export const updateRoleApplicationParamsSchema = z.object({
  applicationId: nonEmptyStringSchema,
})

export const updateRoleApplicationRequestSchema = z
  .object({
    stage: stageSchema.optional(),
    outcome: outcomeSchema.nullable().optional(),
  })
  .refine((value) => value.stage !== undefined || value.outcome !== undefined, {
    message: 'At least one of stage or outcome must be provided',
  })

export const createFutureRoleReviewRequestSchema = z.object({
  triggeringApplicationId: nonEmptyStringSchema,
})

export const updateFutureRoleReviewParamsSchema = z.object({
  reviewId: nonEmptyStringSchema,
})

export const updateFutureRoleReviewRequestSchema = z.object({
  status: z.enum(['Approved', 'Not approved']),
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

export const futureRoleReviewResponseSchema = z.object({
  data: futureRoleReviewSchema,
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
export type Stage = z.infer<typeof stageSchema>
export type Outcome = z.infer<typeof outcomeSchema>
export type ReuseReviewStatus = z.infer<typeof reuseReviewStatusSchema>
export type CandidateProfile = z.infer<typeof candidateProfileSchema>
export type StageHistoryEvent = z.infer<typeof stageHistoryEventSchema>
export type RoleApplication = z.infer<typeof roleApplicationSchema>
export type FutureRoleReview = z.infer<typeof futureRoleReviewSchema>
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
export type CreateFutureRoleReviewRequest = z.infer<
  typeof createFutureRoleReviewRequestSchema
>
export type UpdateFutureRoleReviewParams = z.infer<
  typeof updateFutureRoleReviewParamsSchema
>
export type UpdateFutureRoleReviewRequest = z.infer<
  typeof updateFutureRoleReviewRequestSchema
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
export type FutureRoleReviewResponse = z.infer<
  typeof futureRoleReviewResponseSchema
>
export type ApiError = z.infer<typeof apiErrorSchema>
