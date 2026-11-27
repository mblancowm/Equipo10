CREATE TABLE candidate_profiles (
  candidate_id TEXT PRIMARY KEY NOT NULL,
  source_channel TEXT NOT NULL,
  skills_json TEXT
);

CREATE TABLE role_applications (
  application_id TEXT PRIMARY KEY NOT NULL,
  candidate_id TEXT NOT NULL
    REFERENCES candidate_profiles (candidate_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  role TEXT NOT NULL,
  stage TEXT NOT NULL,
  outcome TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX role_applications_candidate_id_idx
  ON role_applications (candidate_id);

CREATE INDEX role_applications_role_stage_idx
  ON role_applications (role, stage);
