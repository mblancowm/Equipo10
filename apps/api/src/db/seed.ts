import { resolve } from 'node:path'
import {
  candidateProfileSchema,
  roleApplicationSchema,
} from '@equipo10/contracts'
import { db, sqlite } from './database'
import { candidateProfiles, roleApplications } from './schema'

type Fixture = {
  candidateProfiles: unknown[]
  roleApplications: unknown[]
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
      .values(application)
      .onConflictDoUpdate({
        target: roleApplications.applicationId,
        set: {
          candidateId: application.candidateId,
          role: application.role,
          stage: application.stage,
          outcome: application.outcome,
          updatedAt: application.updatedAt,
        },
      })
      .run()
  }
})

seedFixture()

console.log(
  `Seeded ${profiles.length} candidate profiles and ${applications.length} role applications from the synthetic fixture.`,
)
