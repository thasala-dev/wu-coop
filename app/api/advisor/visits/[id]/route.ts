import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get a specific visit by ID
export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT vis.regist_intern_id,
            vis.id,intern.calendar_id, vis.scheduled_date, vis.start_time, vis.end_time,
            vis.visit_type, vis.status, vis.result, vis.comments,
            std.id AS student_id, std.fullname AS student_name, std.student_id AS student_student_id, std.major AS student_major,
            com.id AS company_id, com.name AS company_name, com.location AS company_location,
            com.contact_name AS company_contact_name, com.contact_phone AS company_contact_phone
          FROM supervisions vis
          JOIN regist_intern intern ON vis.regist_intern_id = intern.id
          JOIN user_student std ON intern.student_id = std.id
          JOIN user_company com ON intern.company_id = com.id
          WHERE vis.id = $1
          ORDER BY vis.scheduled_date DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data.length > 0 ? data[0] : null,
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
export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `UPDATE supervisions SET
      result = $2,
      status = 1
      WHERE id = $1
      RETURNING *`,
      [id, body.result]
    );

    return NextResponse.json({
      success: true,
      message: "อัปเดตการนิเทศสำเร็จ",
      visitId: id,
      body: body,
      data: data,
    });
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
    await sql("BEGIN");

    try {
      // 1. Delete associated files from database (files should be deleted from storage separately)
      await sql(`DELETE FROM advisor_visit_files WHERE visit_id = $1`, [
        visitId,
      ]);

      // 2. Delete associated reports
      await sql(`DELETE FROM advisor_visit_reports WHERE visit_id = $1`, [
        visitId,
      ]);

      // 3. Delete associated students
      await sql(`DELETE FROM advisor_visit_students WHERE visit_id = $1`, [
        visitId,
      ]);

      // 4. Delete the visit
      await sql(`DELETE FROM advisor_visits WHERE id = $1`, [visitId]);

      // 5. Commit the transaction
      await sql("COMMIT");

      return NextResponse.json({
        success: true,
        message: "ลบการนิเทศสำเร็จ",
      });
    } catch (error) {
      // If there's an error, roll back the transaction
      await sql("ROLLBACK");
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
