-- Table for student activity categories
CREATE TABLE activity_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default activity categories
INSERT INTO activity_categories (name, name_en, color) VALUES 
('การพัฒนา', 'development', 'blue'),
('การเรียนรู้', 'learning', 'green'),
('การประชุม', 'meeting', 'purple'),
('การค้นคว้าวิจัย', 'research', 'orange'),
('การทดสอบ', 'testing', 'red'),
('อื่นๆ', 'other', 'gray');

-- Table for student activities
CREATE TABLE student_activities (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  activity_date DATE NOT NULL,
  category_id INTEGER REFERENCES activity_categories(id),
  description TEXT NOT NULL,
  learning TEXT,
  problems TEXT,
  solutions TEXT,
  tags TEXT, -- Comma-separated tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for activity files
CREATE TABLE activity_files (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES student_activities(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
