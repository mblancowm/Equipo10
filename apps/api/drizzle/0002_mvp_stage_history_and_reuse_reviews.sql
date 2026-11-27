ALTER TABLE role_applications
  ADD COLUMN department TEXT NOT NULL DEFAULT 'Unassigned';

ALTER TABLE role_applications
  ADD COLUMN stage_history_json TEXT NOT NULL DEFAULT '[]';

CREATE INDEX role_applications_department_stage_idx
  ON role_applications (department, stage);

CREATE UNIQUE INDEX role_applications_application_candidate_uq
  ON role_applications (application_id, candidate_id);

CREATE TABLE future_role_reviews (
  review_id TEXT PRIMARY KEY NOT NULL,
  candidate_id TEXT NOT NULL,
  triggering_application_id TEXT NOT NULL,
  status TEXT NOT NULL
    CHECK (status IN ('Pending', 'Approved', 'Not approved')),
  reviewer_id TEXT,
  reviewed_at TEXT,
  FOREIGN KEY (triggering_application_id, candidate_id)
    REFERENCES role_applications (application_id, candidate_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (
    (status = 'Pending' AND reviewer_id IS NULL AND reviewed_at IS NULL)
    OR
    (status IN ('Approved', 'Not approved')
      AND reviewer_id IS NOT NULL
      AND reviewed_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX future_role_reviews_triggering_application_uq
  ON future_role_reviews (triggering_application_id);

CREATE INDEX future_role_reviews_candidate_status_idx
  ON future_role_reviews (candidate_id, status);
