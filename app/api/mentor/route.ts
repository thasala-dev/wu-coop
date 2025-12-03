import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get("calendarId");

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const query = `
            SELECT com.id, com.name, com.location, com.contact_name,com.contact_phone
            FROM user_company com
            ORDER BY COM.contact_name DESC,com.contact_phone DESC`;

        const datas = await sql(query, []);

        return NextResponse.json({
            success: true,
            message: "ดำเนินการสำเร็จ",
            data: datas,
        });
    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}