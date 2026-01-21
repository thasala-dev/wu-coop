import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get a specific visit by ID
export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT vis.regist_intern_id,
            vis.id,vis.calendar_id, vis.scheduled_date, vis.start_time, vis.end_time,
            vis.visit_type, vis.type, vis.status, vis.result, vis.comments,
            com.id AS company_id, com.name AS company_name, com.location AS company_location,
            com.contact_name AS company_contact_name, com.contact_phone AS company_contact_phone
          FROM supervisions vis
          JOIN user_company com ON vis.regist_intern_id = com.id
          JOIN user_advisor adv ON vis.advisor_id = adv.id
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
    const { id } = await params;
    const body = await request.json();

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
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
  { params }: any
) {
  try {
    const visitId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Start a transaction
    await sql.query("BEGIN");

    try {
      // 1. Delete associated files from database (files should be deleted from storage separately)
      await sql.query(`DELETE FROM advisor_visit_files WHERE visit_id = $1`, [
        visitId,
      ]);

      // 2. Delete associated reports
      await sql.query(`DELETE FROM advisor_visit_reports WHERE visit_id = $1`, [
        visitId,
      ]);

      // 3. Delete associated students
      await sql.query(`DELETE FROM advisor_visit_students WHERE visit_id = $1`, [
        visitId,
      ]);

      // 4. Delete the visit
      await sql.query(`DELETE FROM advisor_visits WHERE id = $1`, [visitId]);

      // 5. Commit the transaction
      await sql.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "ลบการนิเทศสำเร็จ",
      });
    } catch (error) {
      // If there's an error, roll back the transaction
      await sql.query("ROLLBACK");
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
