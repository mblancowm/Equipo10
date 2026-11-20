import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const databasePath =
  process.env.DATABASE_PATH ??
  resolve(import.meta.dir, '../../../../data/equipo10.sqlite')

mkdirSync(dirname(databasePath), { recursive: true })

export const sqlite = new Database(databasePath)
sqlite.exec('PRAGMA foreign_keys = ON')

export const db = drizzle({ client: sqlite, schema })
