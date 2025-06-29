-- Sample data for company_documents table
-- Run this after creating the company_documents table

-- Sample documents for company ID 1
INSERT INTO company_documents (company_id, name, description, file_path, file_type, file_size, mime_type, category, status, uploaded_by) 
VALUES 
(1, 'สัญญาความร่วมมือ MOU 2024', 'บันทึกข้อตกลงความร่วมมือด้านการฝึกงานนักศึกษา', '/uploads/company_1/mou_2024.pdf', 'PDF', 2048576, 'application/pdf', 'contract', 1, 1),
(1, 'แบบประเมินนักศึกษาฝึกงาน', 'แบบฟอร์มประเมินผลการฝึkงานของนักศึกษา', '/uploads/company_1/evaluation_form.docx', 'DOCX', 524288, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'evaluation', 1, 1),
(1, 'คู่มือการฝึกงาน 2024', 'คู่มือสำหรับนักศึกษาฝึกงาน รวมกฎระเบียบและแนวปฏิบัติ', '/uploads/company_1/manual_2024.pdf', 'PDF', 5242880, 'application/pdf', 'manual', 1, 1),
(1, 'รายงานผลการฝึกงานปี 2566', 'สรุปผลการดำเนินงานโครงการฝึกงานนักศึกษาประจำปี 2566', '/uploads/company_1/report_2566.pdf', 'PDF', 3145728, 'application/pdf', 'report', 2, 1),
(1, 'ใบรับรองบริษัท', 'หนังสือรับรองการจดทะเบียนบริษัท', '/uploads/company_1/certificate.jpg', 'JPG', 1048576, 'image/jpeg', 'general', 1, 1);

-- Sample documents for company ID 2
INSERT INTO company_documents (company_id, name, description, file_path, file_type, file_size, mime_type, category, status, uploaded_by) 
VALUES 
(2, 'แบบประเมินพี่เลี้ยงและนักศึกษา', 'แบบประเมินสำหรับพี่เลี้ยงและนักศึกษาฝึกงาน', '/uploads/company_2/mentor_evaluation.xlsx', 'XLSX', 716800, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'evaluation', 1, 1),
(2, 'กฎระเบียบการฝึกงาน', 'กฎระเบียบและข้อปฏิบัติสำหรับนักศึกษาฝึกงาน', '/uploads/company_2/regulations.pdf', 'PDF', 1572864, 'application/pdf', 'manual', 1, 1);

-- Sample documents for company ID 3
INSERT INTO company_documents (company_id, name, description, file_path, file_type, file_size, mime_type, category, status, uploaded_by) 
VALUES 
(3, 'โปรไฟล์บริษัท 2024', 'ข้อมูลบริษัทและการดำเนินงานประจำปี 2024', '/uploads/company_3/company_profile.pdf', 'PDF', 4194304, 'application/pdf', 'general', 1, 1),
(3, 'รายงานการประเมินประจำปี', 'รายงานผลการประเมินการฝึกงานของนักศึกษา', '/uploads/company_3/annual_report.docx', 'DOCX', 892928, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'report', 1, 1);
