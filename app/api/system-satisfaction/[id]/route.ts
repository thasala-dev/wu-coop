import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET - ดึงข้อมูลแบบประเมินความพึงพอใจระบบตาม ID
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        s.id,
        s.p1,
        s.p2,
        s.p3,
        s.p4,
        s.p5,
        s.p6,
        s.p7,
        s.advice,
        s.company_id,
        s.created_at,
        c.name as company_name
      FROM system_satisfaction s
      LEFT JOIN companies c ON s.company_id = c.id
      WHERE s.id = $1
    `;

    const result = await sql.query(query, [id]);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "System satisfaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching system satisfaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch system satisfaction" },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขข้อมูลแบบประเมินความพึงพอใจระบบ
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const { p1, p2, p3, p4, p5, p6, p7, advice, company_id } = body;

    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const existingQuery = `SELECT id FROM system_satisfaction WHERE id = $1`;
    const existing = await sql.query(existingQuery, [id]);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "System satisfaction not found" },
        { status: 404 }
      );
    }

    // ตรวจสอบค่าคะแนน (1-5)
    const scores = [p1, p2, p3, p4, p5, p6, p7];
    for (const score of scores) {
      if (score !== null && score !== undefined && (score < 1 || score > 5)) {
        return NextResponse.json(
          { success: false, error: "Score values must be between 1 and 5" },
          { status: 400 }
        );
      }
    }

    const updateQuery = `
      UPDATE system_satisfaction 
      SET 
        p1 = $1,
        p2 = $2,
        p3 = $3,
        p4 = $4,
        p5 = $5,
        p6 = $6,
        p7 = $7,
        advice = $8,
        company_id = $9
      WHERE id = $10
      RETURNING *
    `;

    const result = await sql.query(updateQuery, [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      advice || null,
      company_id,
      id,
    ]);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "System satisfaction updated successfully",
    });
  } catch (error) {
    console.error("Error updating system satisfaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update system satisfaction" },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูลแบบประเมินความพึงพอใจระบบ
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const existingQuery = `SELECT id FROM system_satisfaction WHERE id = $1`;
    const existing = await sql.query(existingQuery, [id]);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "System satisfaction not found" },
        { status: 404 }
      );
    }

    const deleteQuery = `DELETE FROM system_satisfaction WHERE id = $1`;
    await sql.query(deleteQuery, [id]);

    return NextResponse.json({
      success: true,
      message: "System satisfaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting system satisfaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete system satisfaction" },
      { status: 500 }
    );
  }
}
