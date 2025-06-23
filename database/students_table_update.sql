-- เพิ่มคอลัมน์ใหม่ในตาราง user_student
ALTER TABLE user_student ADD COLUMN advisor_id INT NULL COMMENT 'รหัสอาจารย์ที่ปรึกษา';
ALTER TABLE user_student ADD COLUMN emergency_contact_name VARCHAR(255) NULL COMMENT 'ชื่อผู้ติดต่อกรณีฉุกเฉิน';
ALTER TABLE user_student ADD COLUMN emergency_contact_phone VARCHAR(20) NULL COMMENT 'เบอร์โทรผู้ติดต่อกรณีฉุกเฉิน';
ALTER TABLE user_student ADD COLUMN emergency_contact_relation VARCHAR(100) NULL COMMENT 'ความสัมพันธ์กับผู้ติดต่อกรณีฉุกเฉิน';

-- เพิ่ม Foreign Key Constraint สำหรับ advisor_id (ถ้ามีตาราง user_advisor)
-- ALTER TABLE user_student ADD CONSTRAINT fk_user_student_advisor FOREIGN KEY (advisor_id) REFERENCES user_advisor(id) ON DELETE SET NULL;
