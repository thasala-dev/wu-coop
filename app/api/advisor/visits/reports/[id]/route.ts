import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get a specific report by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    const query = `
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
      WHERE 
        avr.id = $1
    `;
    
    const data = await sql(query, [reportId]);
    
    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลรายงานการนิเทศ" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error in GET /api/advisor/visits/reports/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Update a report
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Check if report exists
    const existingReport = await sql(
      `SELECT * FROM advisor_visit_reports WHERE id = $1`,
      [reportId]
    );
    
    if (existingReport.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลรายงานการนิเทศ" },
        { status: 404 }
      );
    }
    
    // Update the report
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;
    
    if (body.studentPerformance) {
      updateFields.push(`student_performance = $${valueIndex}`);
      updateValues.push(body.studentPerformance);
      valueIndex++;
    }
    
    if (body.strengths !== undefined) {
      updateFields.push(`strengths = $${valueIndex}`);
      updateValues.push(body.strengths);
      valueIndex++;
    }
    
    if (body.improvements !== undefined) {
      updateFields.push(`improvements = $${valueIndex}`);
      updateValues.push(body.improvements);
      valueIndex++;
    }
    
    if (body.recommendations !== undefined) {
      updateFields.push(`recommendations = $${valueIndex}`);
      updateValues.push(body.recommendations);
      valueIndex++;
    }
    
    if (body.mentorFeedback !== undefined) {
      updateFields.push(`mentor_feedback = $${valueIndex}`);
      updateValues.push(body.mentorFeedback);
      valueIndex++;
    }
    
    if (body.companyFeedback !== undefined) {
      updateFields.push(`company_feedback = $${valueIndex}`);
      updateValues.push(body.companyFeedback);
      valueIndex++;
    }
    
    // Always update the updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE advisor_visit_reports
        SET ${updateFields.join(', ')}
        WHERE id = $${valueIndex}
        RETURNING *
      `;
      
      updateValues.push(reportId);
      const data = await sql(updateQuery, updateValues);
      
      return NextResponse.json({
        success: true,
        message: "อัปเดตรายงานการนิเทศสำเร็จ",
        data: data[0],
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "ไม่มีข้อมูลที่ต้องการอัปเดต",
        data: existingReport[0],
      });
    }
    
  } catch (error) {
    console.error("Error in PUT /api/advisor/visits/reports/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตรายงาน" },
      { status: 500 }
    );
  }
}

// Delete a report
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Get the visit ID for the report
    const report = await sql(
      `SELECT visit_id FROM advisor_visit_reports WHERE id = $1`,
      [reportId]
    );
    
    if (report.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลรายงานการนิเทศ" },
        { status: 404 }
      );
    }
    
    // Delete the report
    await sql(
      `DELETE FROM advisor_visit_reports WHERE id = $1`,
      [reportId]
    );
    
    // Check if there are any other reports for this visit
    const remainingReports = await sql(
      `SELECT COUNT(*) as count FROM advisor_visit_reports WHERE visit_id = $1`,
      [report[0].visit_id]
    );
    
    // If no reports remain, update the visit status back to 'upcoming'
    if (parseInt(remainingReports[0].count) === 0) {
      await sql(
        `UPDATE advisor_visits 
         SET status = 'upcoming', updated_at = NOW()
         WHERE id = $1`,
        [report[0].visit_id]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "ลบรายงานการนิเทศสำเร็จ",
    });
    
  } catch (error) {
    console.error("Error in DELETE /api/advisor/visits/reports/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบรายงาน" },
      { status: 500 }
    );
  }
}
