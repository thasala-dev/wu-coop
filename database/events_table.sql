-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  calendar_id INTEGER NOT NULL REFERENCES calendar(id),
  type_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups by calendar
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events(calendar_id);

-- Insert sample data
INSERT INTO events (title, description, event_date, location, calendar_id, type_id, status_id)
VALUES 
  ('ปฐมนิเทศนักศึกษาสหกิจศึกษา', 'ปฐมนิเทศนักศึกษาก่อนออกสหกิจศึกษา', '2025-07-15', 'ห้องประชุมคณะวิทยาศาสตร์', 1, 3, 2),
  ('อบรมการใช้เครื่องมือในสถานประกอบการ', 'อบรมการใช้เครื่องมือและความปลอดภัยในสถานประกอบการ', '2025-07-20', 'ห้องปฏิบัติการคณะวิศวกรรมศาสตร์', 1, 2, 2),
  ('นำเสนอโครงงานสหกิจศึกษา', 'นำเสนอโครงงานหลังกลับจากสหกิจศึกษา', '2025-11-15', 'หอประชุมมหาวิทยาลัย', 1, 4, 3),
  ('ประชุมอาจารย์นิเทศ', 'ประชุมอาจารย์นิเทศสหกิจศึกษาประจำภาคการศึกษา', '2025-06-25', 'ห้องประชุม 2 อาคารบริหาร', 1, 1, 1);

-- Event types reference
-- 1: การประชุม
-- 2: อบรม
-- 3: สัมมนา
-- 4: นำเสนอผลงาน
-- 5: ประเมินผล
-- 6: อื่นๆ

-- Status reference
-- 1: กำลังดำเนินการ
-- 2: กำลังจะมาถึง
-- 3: เสร็จสิ้น
-- 4: ยกเลิก
