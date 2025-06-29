import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// DELETE: ลบเอกสาร
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const companyId = pathSegments[pathSegments.length - 3];
    const documentId = pathSegments[pathSegments.length - 1];

    const sql = neon(`${process.env.DATABASE_URL}`);

    // ตรวจสอบว่าเอกสารมีอยู่และเป็นของบริษัทนี้
    const document = await sql(
      `DELETE FROM company_documents WHERE id = $1 RETURNING *`,
      [documentId]
    );

    return NextResponse.json({
      success: true,
      message: "ลบเอกสารสำเร็จ",
      data: {
        id: documentId,
        file_path: document[0].file_path,
      },
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
