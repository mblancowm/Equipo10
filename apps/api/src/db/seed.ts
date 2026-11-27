import { resolve } from 'node:path'
import {
  candidateProfileSchema,
  futureRoleReviewSchema,
  roleApplicationSchema,
} from '@equipo10/contracts'
import { db, sqlite } from './database'
import {
  candidateProfiles,
  futureRoleReviews,
  roleApplications,
} from './schema'

type Fixture = {
  candidateProfiles: unknown[]
  roleApplications: unknown[]
  futureRoleReviews?: unknown[]
}

const fixturePath = resolve(
  import.meta.dir,
  '../../../../docs/data/fixtures/template.synthetic.json',
)
const fixture = (await Bun.file(fixturePath).json()) as Fixture
const profiles = fixture.candidateProfiles.map((profile) =>
  candidateProfileSchema.parse(profile),
)
const applications = fixture.roleApplications.map((application) =>
  roleApplicationSchema.parse(application),
)
const reviews = (fixture.futureRoleReviews ?? []).map((review) =>
  futureRoleReviewSchema.parse(review),
)

for (const review of reviews) {
  const triggeringApplication = applications.find(
    (application) =>
      application.applicationId === review.triggeringApplicationId,
  )

  if (
    !triggeringApplication ||
    triggeringApplication.candidateId !== review.candidateId ||
    triggeringApplication.outcome !== 'Not selected' ||
    !triggeringApplication.stageHistory.some(
      (event) => event.stage === 'Screening passed',
    ) ||
    !triggeringApplication.stageHistory.some(
      (event) => event.stage === 'Final interview',
    )
  ) {
    throw new Error(
      'Future-role review ' +
        review.reviewId +
        ' must reference the same candidate application that passed screening, reached Final interview, and ended Not selected.',
    )
  }
}

const seedFixture = sqlite.transaction(() => {
  for (const profile of profiles) {
    db.insert(candidateProfiles)
      .values({
        candidateId: profile.candidateId,
        sourceChannel: profile.sourceChannel,
        skillsJson:
          profile.skills === undefined ? null : JSON.stringify(profile.skills),
      })
      .onConflictDoUpdate({
        target: candidateProfiles.candidateId,
        set: {
          sourceChannel: profile.sourceChannel,
          skillsJson:
            profile.skills === undefined ? null : JSON.stringify(profile.skills),
        },
      })
      .run()
  }

  for (const application of applications) {
    db.insert(roleApplications)
      .values({
        applicationId: application.applicationId,
        candidateId: application.candidateId,
        role: application.role,
        department: application.department,
        stage: application.stage,
        stageHistoryJson: JSON.stringify(application.stageHistory),
        outcome: application.outcome,
        updatedAt: application.updatedAt,
      })
      .onConflictDoUpdate({
        target: roleApplications.applicationId,
        set: {
          candidateId: application.candidateId,
          role: application.role,
          department: application.department,
          stage: application.stage,
          stageHistoryJson: JSON.stringify(application.stageHistory),
          outcome: application.outcome,
          updatedAt: application.updatedAt,
        },
      })
      .run()
  }

  for (const review of reviews) {
    db.insert(futureRoleReviews)
      .values(review)
      .onConflictDoUpdate({
        target: futureRoleReviews.reviewId,
        set: {
          candidateId: review.candidateId,
          triggeringApplicationId: review.triggeringApplicationId,
          status: review.status,
          reviewerId: review.reviewerId,
          reviewedAt: review.reviewedAt,
        },
      })
      .run()
  }
})

seedFixture()

console.log(
  'Seeded ' +
    profiles.length +
    ' candidate profiles, ' +
    applications.length +
    ' role applications, and ' +
    reviews.length +
    ' future-role reviews from the synthetic fixture.',
)
