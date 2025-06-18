import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get a specific visit by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Get visit details with students and company info
    const visitQuery = `
      SELECT 
        av.*,
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.fullname,
            'studentId', s.student_id,
            'major', s.major
          )
        ) as students,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'address', c.address,
          'location', c.province,
          'contact', c.contact_name,
          'phone', c.contact_phone,
          'email', c.contact_email
        ) as company
      FROM 
        advisor_visits av
      JOIN 
        advisor_visit_students avs ON av.id = avs.visit_id
      JOIN 
        user_student s ON avs.student_id = s.id
      JOIN 
        user_company c ON av.company_id = c.id
      WHERE
        av.id = $1
      GROUP BY 
        av.id, c.id
    `;
    
    const visitData = await sql(visitQuery, [visitId]);
    
    if (visitData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการนิเทศ" },
        { status: 404 }
      );
    }
    
    // Get visit reports if it's a completed visit
    if (visitData[0].status === 'completed') {
      const reportsQuery = `
        SELECT * 
        FROM advisor_visit_reports
        WHERE visit_id = $1
      `;
      
      const reportsData = await sql(reportsQuery, [visitId]);
      visitData[0].reports = reportsData;
    }
    
    // Get visit files
    const filesQuery = `
      SELECT * 
      FROM advisor_visit_files
      WHERE visit_id = $1
      ORDER BY created_at DESC
    `;
    
    const filesData = await sql(filesQuery, [visitId]);
    visitData[0].files = filesData;
    
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: visitData[0],
    });
    
  } catch (error) {
    console.error("Error in GET /api/advisor/visits/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Update a visit
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = params.id;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Start a transaction
    await sql('BEGIN');
    
    try {
      // 1. Update the visit record
      const updateFields = [];
      const updateValues = [];
      let valueIndex = 1;
      
      if (body.visitDate) {
        updateFields.push(`visit_date = $${valueIndex}`);
        updateValues.push(body.visitDate);
        valueIndex++;
      }
      
      if (body.visitTimeStart) {
        updateFields.push(`visit_time_start = $${valueIndex}`);
        updateValues.push(body.visitTimeStart);
        valueIndex++;
      }
      
      if (body.visitTimeEnd) {
        updateFields.push(`visit_time_end = $${valueIndex}`);
        updateValues.push(body.visitTimeEnd);
        valueIndex++;
      }
      
      if (body.companyId) {
        updateFields.push(`company_id = $${valueIndex}`);
        updateValues.push(body.companyId);
        valueIndex++;
      }
      
      if (body.visitType) {
        updateFields.push(`visit_type = $${valueIndex}`);
        updateValues.push(body.visitType);
        valueIndex++;
      }
      
      if (body.status) {
        updateFields.push(`status = $${valueIndex}`);
        updateValues.push(body.status);
        valueIndex++;
      }
      
      if (body.transportation) {
        updateFields.push(`transportation = $${valueIndex}`);
        updateValues.push(body.transportation);
        valueIndex++;
      }
      
      if (body.distance) {
        updateFields.push(`distance = $${valueIndex}`);
        updateValues.push(body.distance);
        valueIndex++;
      }
      
      // Always update the updated_at timestamp
      updateFields.push(`updated_at = NOW()`);
      
      if (updateFields.length > 0) {
        const updateQuery = `
          UPDATE advisor_visits
          SET ${updateFields.join(', ')}
          WHERE id = $${valueIndex}
          RETURNING *
        `;
        
        updateValues.push(visitId);
        await sql(updateQuery, updateValues);
      }
      
      // 2. Update students if provided
      if (body.studentIds && Array.isArray(body.studentIds)) {
        // Delete existing student associations
        await sql(
          `DELETE FROM advisor_visit_students WHERE visit_id = $1`,
          [visitId]
        );
        
        // Add new student associations
        for (const studentId of body.studentIds) {
          await sql(
            `INSERT INTO advisor_visit_students (visit_id, student_id)
             VALUES ($1, $2)`,
            [visitId, studentId]
          );
        }
      }
      
      // 3. Commit the transaction
      await sql('COMMIT');
      
      // 4. Return the updated visit with student details
      const updatedVisit = await sql(
        `SELECT 
          av.*,
          json_agg(
            json_build_object(
              'id', s.id,
              'name', s.fullname,
              'studentId', s.student_id,
              'major', s.major
            )
          ) as students,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'address', c.address,
            'location', c.province,
            'contact', c.contact_name,
            'phone', c.contact_phone,
            'email', c.contact_email
          ) as company
        FROM 
          advisor_visits av
        JOIN 
          advisor_visit_students avs ON av.id = avs.visit_id
        JOIN 
          user_student s ON avs.student_id = s.id
        JOIN 
          user_company c ON av.company_id = c.id
        WHERE
          av.id = $1
        GROUP BY 
          av.id, c.id`,
        [visitId]
      );
      
      return NextResponse.json({
        success: true,
        message: "อัปเดตการนิเทศสำเร็จ",
        data: updatedVisit[0],
      });
      
    } catch (error) {
      // If there's an error, roll back the transaction
      await sql('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error("Error in PUT /api/advisor/visits/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตการนิเทศ" },
      { status: 500 }
    );
  }
}

// Delete a visit
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Start a transaction
    await sql('BEGIN');
    
    try {
      // 1. Delete associated files from database (files should be deleted from storage separately)
      await sql(
        `DELETE FROM advisor_visit_files WHERE visit_id = $1`,
        [visitId]
      );
      
      // 2. Delete associated reports
      await sql(
        `DELETE FROM advisor_visit_reports WHERE visit_id = $1`,
        [visitId]
      );
      
      // 3. Delete associated students
      await sql(
        `DELETE FROM advisor_visit_students WHERE visit_id = $1`,
        [visitId]
      );
      
      // 4. Delete the visit
      await sql(
        `DELETE FROM advisor_visits WHERE id = $1`,
        [visitId]
      );
      
      // 5. Commit the transaction
      await sql('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: "ลบการนิเทศสำเร็จ",
      });
      
    } catch (error) {
      // If there's an error, roll back the transaction
      await sql('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error("Error in DELETE /api/advisor/visits/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบการนิเทศ" },
      { status: 500 }
    );
  }
}
