import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  index,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const candidateProfiles = sqliteTable('candidate_profiles', {
  candidateId: text('candidate_id').primaryKey(),
  sourceChannel: text('source_channel').notNull(),
  skillsJson: text('skills_json'),
})

export const roleApplications = sqliteTable(
  'role_applications',
  {
    applicationId: text('application_id').primaryKey(),
    candidateId: text('candidate_id')
      .notNull()
      .references(() => candidateProfiles.candidateId, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    role: text('role').notNull(),
    department: text('department').notNull(),
    stage: text('stage').notNull(),
    stageHistoryJson: text('stage_history_json').notNull(),
    outcome: text('outcome'),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('role_applications_candidate_id_idx').on(table.candidateId),
    index('role_applications_role_stage_idx').on(table.role, table.stage),
    index('role_applications_department_stage_idx').on(
      table.department,
      table.stage,
    ),
    uniqueIndex('role_applications_application_candidate_uq').on(
      table.applicationId,
      table.candidateId,
    ),
  ],
)

export const futureRoleReviews = sqliteTable(
  'future_role_reviews',
  {
    reviewId: text('review_id').primaryKey(),
    candidateId: text('candidate_id').notNull(),
    triggeringApplicationId: text('triggering_application_id').notNull(),
    status: text('status').notNull(),
    reviewerId: text('reviewer_id'),
    reviewedAt: text('reviewed_at'),
  },
  (table) => [
    foreignKey({
      name: 'future_role_reviews_application_candidate_fk',
      columns: [table.triggeringApplicationId, table.candidateId],
      foreignColumns: [
        roleApplications.applicationId,
        roleApplications.candidateId,
      ],
    }).onDelete('restrict').onUpdate('cascade'),
    uniqueIndex('future_role_reviews_triggering_application_uq').on(
      table.triggeringApplicationId,
    ),
    index('future_role_reviews_candidate_status_idx').on(
      table.candidateId,
      table.status,
    ),
    check(
      'future_role_reviews_status_check',
      sql.raw("status in ('Pending', 'Approved', 'Not approved')"),
    ),
    check(
      'future_role_reviews_reviewer_check',
      sql.raw(
        "(status = 'Pending' and reviewer_id is null and reviewed_at is null) or (status in ('Approved', 'Not approved') and reviewer_id is not null and reviewed_at is not null)",
      ),
    ),
  ],
)
