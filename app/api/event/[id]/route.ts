import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT e.*, c.name as calendar_name
       FROM events e
       LEFT JOIN calendar c ON e.calendar_id = c.id
       WHERE e.id = $1`,
      [id]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรม" },
        { status: 404 }
      );
    } else {
      // Format date for frontend
      if (data[0].event_date) {
        data[0].event_date = data[0].event_date.toISOString().split("T")[0];
      }
      
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `UPDATE events SET 
       title = $2, 
       description = $3, 
       event_date = $4, 
       location = $5, 
       calendar_id = $6, 
       type_id = $7, 
       status_id = $8 
       WHERE id = $1 
       RETURNING *`,
      [
        id,
        body.title,
        body.description,
        body.eventDate,
        body.location,
        body.calendarId,
        body.typeId || 1,
        body.statusId || 1,
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: "บันทึกสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Check if event exists
    const checkEvent = await sql("SELECT id FROM events WHERE id = $1", [id]);
    if (checkEvent.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรม" },
        { status: 404 }
      );
    }
    
    // Delete the event
    await sql("DELETE FROM events WHERE id = $1", [id]);
    
    return NextResponse.json({
      success: true,
      message: "ลบกิจกรรมสำเร็จ",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
