import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_company WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    } else {
      const calendar = await sql(
        "SELECT * FROM calendar ORDER BY start_date DESC"
      );

      let regist = await sql(
        `SELECT reg.id,reg.calendar_id,cal.name,cal.semester,cal.year,reg.total,cal.active_id,cal.start_date,cal.end_date
        FROM regist_company reg
        INNER JOIN calendar cal ON reg.calendar_id = cal.id
        WHERE reg.company_id = $1
        ORDER BY cal.start_date DESC`,
        [id]
      );

      if (regist.length > 0) {
        for (let index = 0; index < regist.length; index++) {
          const intern = await sql(
            `SELECT std.fullname,std.student_id,std.image,std.major
            FROM regist_intern intern
            INNER JOIN user_student std ON intern.student_id = std.id
            WHERE intern.calendar_id = $1 AND intern.company_id = $2`,
            [regist[index].calendar_id, id]
          );
          regist[index].intern = intern;
        }
      }

      let current = regist.find((cal: any) => cal.active_id === 1) || [];
      if (!current) {
        current = calendar[0] || [];
      }

      // Fetch company documents
      const documents = await sql(
        `
        SELECT 
          id,
          name,
          description,
          file_type,
          file_size,
          updated_at
        FROM company_documents WHERE company_id = $1
        ORDER BY updated_at DESC
      `,
        [id]
      );

      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
        calendar: calendar,
        regist: regist,
        current: current,
        documents: documents,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
