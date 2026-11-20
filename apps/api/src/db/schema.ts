import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
    stage: text('stage').notNull(),
    outcome: text('outcome'),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('role_applications_candidate_id_idx').on(table.candidateId),
    index('role_applications_role_stage_idx').on(table.role, table.stage),
  ],
)
