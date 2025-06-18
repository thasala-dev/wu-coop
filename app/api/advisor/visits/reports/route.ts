import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get all reports for a specific visit
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const visitId = url.searchParams.get("visitId");
    const studentId = url.searchParams.get("studentId");
    
    if (!visitId && !studentId) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุรหัสการนิเทศหรือรหัสนักศึกษา" },
        { status: 400 }
      );
    }
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    let query = `
      SELECT 
        avr.*,
        s.fullname as student_name,
        s.student_id as student_code,
        av.visit_date,
        c.name as company_name
      FROM 
        advisor_visit_reports avr
      JOIN 
        advisor_visits av ON avr.visit_id = av.id
      JOIN 
        user_student s ON avr.student_id = s.id
      JOIN 
        user_company c ON av.company_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (visitId) {
      query += ` AND avr.visit_id = $${paramIndex}`;
      params.push(visitId);
      paramIndex++;
    }
    
    if (studentId) {
      query += ` AND avr.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }
    
    query += ` ORDER BY av.visit_date DESC`;
    
    const data = await sql(query, params);
    
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error in GET /api/advisor/visits/reports:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Create a new report
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.visitId || !body.studentId || !body.studentPerformance) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุข้อมูลที่จำเป็น" },
        { status: 400 }
      );
    }
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Check if a report already exists for this visit and student
    const existingReport = await sql(
      `SELECT * FROM advisor_visit_reports 
       WHERE visit_id = $1 AND student_id = $2`,
      [body.visitId, body.studentId]
    );
    
    if (existingReport.length > 0) {
      return NextResponse.json(
        { success: false, message: "มีรายงานการนิเทศสำหรับนักศึกษานี้แล้ว" },
        { status: 400 }
      );
    }
    
    // Create new report
    const data = await sql(
      `INSERT INTO advisor_visit_reports 
        (visit_id, student_id, student_performance, strengths, improvements, 
         recommendations, mentor_feedback, company_feedback) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.visitId,
        body.studentId,
        body.studentPerformance,
        body.strengths || null,
        body.improvements || null,
        body.recommendations || null,
        body.mentorFeedback || null,
        body.companyFeedback || null
      ]
    );
    
    // Update the visit status to 'completed' if not already
    await sql(
      `UPDATE advisor_visits 
       SET status = 'completed', updated_at = NOW()
       WHERE id = $1 AND status != 'completed'`,
      [body.visitId]
    );
    
    return NextResponse.json({
      success: true,
      message: "บันทึกรายงานการนิเทศสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error in POST /api/advisor/visits/reports:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกรายงาน" },
      { status: 500 }
    );
  }
}
