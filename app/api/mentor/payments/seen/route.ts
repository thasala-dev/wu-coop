import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireRole } from "@/lib/auth-server";

// POST - บันทึกว่าแหล่งฝึกเห็นรายการชำระเงินแล้ว (บันทึกเฉพาะครั้งแรก)
export async function POST(request: NextRequest) {
  const session = await requireRole(request, ["mentor"]);
  if (session instanceof NextResponse) return session;

  const companyId = parseInt(String(session.id));
  if (!Number.isFinite(companyId)) {
    return NextResponse.json(
      { success: false, message: "ไม่พบข้อมูลแหล่งฝึก" },
      { status: 400 }
    );
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql.query(
      `
      UPDATE payments
      SET seen_at = NOW()
      WHERE company_id = $1 AND seen_at IS NULL
      RETURNING id
    `,
      [companyId]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: { updated: result.length },
    });
  } catch (error) {
    console.error("Error marking payments as seen:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
