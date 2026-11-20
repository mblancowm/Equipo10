import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sqlite } from './database'

const migrationsDirectory = resolve(import.meta.dir, '../../drizzle')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)

const appliedMigrations = new Set(
  sqlite
    .query('SELECT filename FROM schema_migrations')
    .all()
    .map((row) => (row as { filename: string }).filename),
)

const migrationFiles = readdirSync(migrationsDirectory)
  .filter((filename) => filename.endsWith('.sql'))
  .sort()

const applyMigration = sqlite.transaction((filename: string) => {
  if (appliedMigrations.has(filename)) return

  const sql = readFileSync(resolve(migrationsDirectory, filename), 'utf8')
  sqlite.exec(sql)
  sqlite
    .query('INSERT INTO schema_migrations (filename) VALUES (?)')
    .run(filename)
})

for (const filename of migrationFiles) {
  applyMigration(filename)
}

console.log(`Applied pending migrations to ${process.env.DATABASE_PATH ?? 'data/equipo10.sqlite'}`)
