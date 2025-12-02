import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET - ดึงข้อมูลแบบประเมินความพึงพอใจระบบ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const view = searchParams.get("view");

    const offset = (page - 1) * limit;

    // สร้าง WHERE clause
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];


    if (role && role !== "all") {
      whereClause += ` AND sys_form.role = $${queryParams.length + 1}`;
      queryParams.push(role);
    }

    // ดึงข้อมูลแบบประเมิน
    let satisfactionQuery = `
      WITH ranked AS (
          SELECT
              sys_form.id,
              sys_form.p1,
              sys_form.p2,
              sys_form.p3,
              sys_form.p4,
              sys_form.p5,
              sys_form.p6,
              sys_form.p7,
              sys_form.advice,
              sys_form.company_id,
              sys_form.role,
              CASE 
                  WHEN sys_form.role = 'student' THEN user_student.fullname
                  WHEN sys_form.role = 'advisor' THEN user_advisor.fullname
                  WHEN sys_form.role = 'mentor' THEN user_company.name
                  ELSE 'Unknown'
              END AS company_name,
              sys_form.created_at,
              ROW_NUMBER() OVER (
                  PARTITION BY sys_form.company_id, sys_form.role
                  ORDER BY sys_form.created_at DESC
              ) AS rn
          FROM system_satisfaction AS sys_form
          LEFT JOIN user_company  ON sys_form.company_id = user_company.id
          LEFT JOIN user_student  ON sys_form.company_id = user_student.id
          LEFT JOIN user_advisor  ON sys_form.company_id = user_advisor.id
          ${whereClause}
      )
      SELECT *
      FROM ranked
      WHERE rn = 1
      ORDER BY created_at DESC;`;

    if (view === "all") {
      satisfactionQuery = `
        SELECT
            sys_form.id,
            sys_form.p1,
            sys_form.p2,
            sys_form.p3,
            sys_form.p4,
            sys_form.p5,
            sys_form.p6,
            sys_form.p7,
            sys_form.advice,
            sys_form.company_id,
            sys_form.role,
            CASE 
                WHEN sys_form.role = 'student' THEN user_student.fullname
                WHEN sys_form.role = 'advisor' THEN user_advisor.fullname
                WHEN sys_form.role = 'mentor' THEN user_company.name
                ELSE 'Unknown'
            END AS company_name,
            sys_form.created_at
        FROM system_satisfaction AS sys_form
        LEFT JOIN user_company  ON sys_form.company_id = user_company.id
        LEFT JOIN user_student  ON sys_form.company_id = user_student.id
        LEFT JOIN user_advisor  ON sys_form.company_id = user_advisor.id
        ${whereClause}
        ORDER BY sys_form.created_at DESC;`;
    }

    const satisfaction = await sql(satisfactionQuery, queryParams);

    return NextResponse.json({
      success: true,
      data: satisfaction,
    });
  } catch (error) {
    console.error("Error fetching system satisfaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch system satisfaction data" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มข้อมูลแบบประเมินความพึงพอใจระบบใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { p1, p2, p3, p4, p5, p6, p7, advice, company_id, role } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!company_id) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
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

    const insertQuery = `
      INSERT INTO system_satisfaction (
        p1, p2, p3, p4, p5, p6, p7, 
        advice, company_id, role, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 
        $8, $9, $10, NOW()
      ) RETURNING *
    `;

    const result = await sql(insertQuery, [
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      advice || null,
      company_id,
      role
    ]);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "System satisfaction created successfully",
    });
  } catch (error) {
    console.error("Error creating system satisfaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create system satisfaction" },
      { status: 500 }
    );
  }
}
