-- Table for advisor visits
CREATE TABLE advisor_visits (
  id SERIAL PRIMARY KEY,
  advisor_id INTEGER NOT NULL,
  visit_date DATE NOT NULL,
  visit_time_start TIME NOT NULL,
  visit_time_end TIME NOT NULL,
  calendar_id INTEGER NOT NULL, -- Reference to the academic term
  company_id INTEGER NOT NULL,
  visit_type VARCHAR(50) NOT NULL DEFAULT 'onsite', -- onsite, online
  status VARCHAR(50) NOT NULL DEFAULT 'upcoming', -- upcoming, completed, cancelled
  transportation VARCHAR(100),
  distance INTEGER, -- Distance in kilometers for travel expense calculation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for students in a visit (multiple students can be in one visit)
CREATE TABLE advisor_visit_students (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES advisor_visits(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for visit reports
CREATE TABLE advisor_visit_reports (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES advisor_visits(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  student_performance TEXT NOT NULL, -- ดี, พอใช้, ต้องปรับปรุง
  strengths TEXT,
  improvements TEXT,
  recommendations TEXT,
  mentor_feedback TEXT,
  company_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for visit files (photos, documents)
CREATE TABLE advisor_visit_files (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES advisor_visits(id) ON DELETE CASCADE,
  file_type VARCHAR(50) NOT NULL, -- photo, document
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookup
CREATE INDEX idx_advisor_visits_advisor_id ON advisor_visits(advisor_id);
CREATE INDEX idx_advisor_visits_calendar_id ON advisor_visits(calendar_id);
CREATE INDEX idx_advisor_visits_company_id ON advisor_visits(company_id);
CREATE INDEX idx_advisor_visits_status ON advisor_visits(status);
CREATE INDEX idx_advisor_visit_students_visit_id ON advisor_visit_students(visit_id);
CREATE INDEX idx_advisor_visit_students_student_id ON advisor_visit_students(student_id);
CREATE INDEX idx_advisor_visit_reports_visit_id ON advisor_visit_reports(visit_id);
CREATE INDEX idx_advisor_visit_reports_student_id ON advisor_visit_reports(student_id);
CREATE INDEX idx_advisor_visit_files_visit_id ON advisor_visit_files(visit_id);
