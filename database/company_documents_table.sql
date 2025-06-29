-- Table สำหรับเก็บเอกสารของแหล่งฝึกงาน
CREATE TABLE company_documents (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES user_company(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- PDF, DOCX, XLSX, etc.
    file_size BIGINT NOT NULL, -- ขนาดไฟล์ในหน่วย bytes
    mime_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'general', -- contract, evaluation, manual, report, etc.
    status INTEGER DEFAULT 1, -- 1=active, 0=inactive, 2=archived
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_del INTEGER DEFAULT 0
);

-- Index สำหรับประสิทธิภาพ
CREATE INDEX idx_company_documents_company_id ON company_documents(company_id);
CREATE INDEX idx_company_documents_status ON company_documents(status);
CREATE INDEX idx_company_documents_category ON company_documents(category);

-- Comment สำหรับอธิบาย
COMMENT ON TABLE company_documents IS 'เก็บข้อมูลเอกสารที่เกี่ยวข้องกับแหล่งฝึกงาน';
COMMENT ON COLUMN company_documents.category IS 'ประเภทเอกสาร: contract=สัญญา, evaluation=แบบประเมิน, manual=คู่มือ, report=รายงาน, general=ทั่วไป';
COMMENT ON COLUMN company_documents.status IS 'สถานะ: 1=ใช้งาน, 0=ไม่ใช้งาน, 2=เก็บถาวร';
