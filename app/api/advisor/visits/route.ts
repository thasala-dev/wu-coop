import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get all visits for an advisor
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const advisorId = url.searchParams.get("advisorId");

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT vis.regist_intern_id,
        vis.id,intern.calendar_id, vis.scheduled_date, vis.start_time, vis.end_time,
        vis.visit_type,vis.type, vis.status, vis.comments,
        std.id AS student_id, std.fullname AS student_name, std.student_id AS student_student_id, std.major AS student_major,
        com.id AS company_id, com.name AS company_name, com.location AS company_location,
        com.contact_name AS company_contact_name, com.contact_phone AS company_contact_phone
      FROM supervisions vis
      JOIN regist_intern intern ON vis.regist_intern_id = intern.id
      JOIN user_student std ON intern.student_id = std.id
      JOIN user_company com ON intern.company_id = com.id
      WHERE vis.advisor_id = $1
      ORDER BY vis.scheduled_date DESC`,
      [advisorId]
    );

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
    await sql("BEGIN");

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
          body.visitType || "onsite",
          body.status || "upcoming",
          body.transportation,
          body.distance,
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
      await sql("COMMIT");

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
      await sql("ROLLBACK");
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
