import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get all visits for an advisor
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const advisorId = url.searchParams.get("advisorId");
    const calendarId = url.searchParams.get("calendarId");
    const status = url.searchParams.get("status");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    let query = `
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
    `;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (advisorId) {
      conditions.push(`av.advisor_id = $${paramIndex}`);
      params.push(advisorId);
      paramIndex++;
    }
    
    if (calendarId) {
      conditions.push(`av.calendar_id = $${paramIndex}`);
      params.push(calendarId);
      paramIndex++;
    }
    
    if (status) {
      conditions.push(`av.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    if (month && year) {
      conditions.push(`EXTRACT(MONTH FROM av.visit_date) = $${paramIndex} AND EXTRACT(YEAR FROM av.visit_date) = $${paramIndex + 1}`);
      params.push(month, year);
      paramIndex += 2;
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += `
      GROUP BY 
        av.id, c.id
      ORDER BY 
        av.visit_date ASC, av.visit_time_start ASC
    `;
    
    const data = await sql(query, params);
    
    // For completed visits, fetch the report data
    if (data.length > 0 && (status === 'completed' || !status)) {
      const completedVisitIds = data
        .filter(visit => visit.status === 'completed')
        .map(visit => visit.id);
      
      if (completedVisitIds.length > 0) {
        const reportsQuery = `
          SELECT 
            visit_id, 
            json_agg(
              json_build_object(
                'id', id,
                'studentId', student_id,
                'performance', student_performance,
                'strengths', strengths,
                'improvements', improvements,
                'recommendations', recommendations
              )
            ) as reports
          FROM 
            advisor_visit_reports
          WHERE 
            visit_id = ANY($1)
          GROUP BY 
            visit_id
        `;
        
        const reports = await sql(reportsQuery, [completedVisitIds]);
        
        // Merge reports with visits data
        data.forEach(visit => {
          if (visit.status === 'completed') {
            const visitReport = reports.find(r => r.visit_id === visit.id);
            visit.reports = visitReport ? visitReport.reports : [];
          }
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error in GET /api/advisor/visits:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Create a new visit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Start a transaction
    await sql('BEGIN');
    
    try {
      // 1. Create the visit record
      const visitResult = await sql(
        `INSERT INTO advisor_visits 
          (advisor_id, visit_date, visit_time_start, visit_time_end, calendar_id, 
           company_id, visit_type, status, transportation, distance) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          body.advisorId,
          body.visitDate,
          body.visitTimeStart,
          body.visitTimeEnd,
          body.calendarId,
          body.companyId,
          body.visitType || 'onsite',
          body.status || 'upcoming',
          body.transportation,
          body.distance
        ]
      );
      
      const visitId = visitResult[0].id;
      
      // 2. Add students to the visit
      for (const studentId of body.studentIds) {
        await sql(
          `INSERT INTO advisor_visit_students (visit_id, student_id)
           VALUES ($1, $2)`,
          [visitId, studentId]
        );
      }
      
      // 3. Commit the transaction
      await sql('COMMIT');
      
      // 4. Return the created visit with student details
      const createdVisit = await sql(
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
        message: "สร้างการนิเทศสำเร็จ",
        data: createdVisit[0],
      });
      
    } catch (error) {
      // If there's an error, roll back the transaction
      await sql('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error("Error in POST /api/advisor/visits:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการสร้างการนิเทศ" },
      { status: 500 }
    );
  }
}
