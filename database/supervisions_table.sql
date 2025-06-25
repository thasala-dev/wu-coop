-- เพิ่มตาราง supervisions สำหรับการนิเทศ
CREATE TABLE IF NOT EXISTS supervisions (
  id SERIAL PRIMARY KEY,
  regist_intern_id INTEGER NOT NULL,          -- อ้างอิงไปยังตาราง regist_intern
  advisor_id INTEGER NOT NULL,                -- อ้างอิงไปยังตาราง user_advisor
  scheduled_date DATE NOT NULL,               -- วันที่นัดนิเทศ
  start_time TIME,                            -- เวลาเริ่มต้นการนิเทศ
  end_time TIME,                              -- เวลาสิ้นสุดการนิเทศ
  status INTEGER DEFAULT 0,                   -- สถานะการนิเทศ: 0=รอนิเทศ, 1=นิเทศแล้ว, 2=ยกเลิก
  visit_type VARCHAR(50),                     -- รูปแบบการนิเทศ: ออนไลน์, ออนไซต์, ฯลฯ
  comments TEXT,                              -- บันทึกเพิ่มเติมจากอาจารย์นิเทศ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (regist_intern_id) REFERENCES regist_intern(id) ON DELETE CASCADE,
  FOREIGN KEY (advisor_id) REFERENCES user_advisor(id) ON DELETE CASCADE
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX IF NOT EXISTS idx_supervisions_regist_intern_id ON supervisions(regist_intern_id);
CREATE INDEX IF NOT EXISTS idx_supervisions_advisor_id ON supervisions(advisor_id);
CREATE INDEX IF NOT EXISTS idx_supervisions_scheduled_date ON supervisions(scheduled_date);
