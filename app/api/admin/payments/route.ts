import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// ประเภทข้อมูลการชำระเงิน
interface Payment {
  id: string;
  calendar_id: number;
  company_id: number;
  amount: number;
  detail?: string | null;
  payment_date: string;
  file_attachment?: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// GET - ดึงข้อมูลการชำระเงินทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const companyId = searchParams.get("company_id");

    const sql = neon(`${process.env.DATABASE_URL}`);

    // ดึงข้อมูลการชำระเงิน พร้อมข้อมูลปีการศึกษาและบริษัท
    const payments = await sql(
      companyId
        ? `
      SELECT 
        p.*,
        c.name as calendar_name,
        comp.name as company_name,
        c.semester,
        c.year
      FROM payments p
      LEFT JOIN calendar c ON p.calendar_id = c.id
      LEFT JOIN user_company comp ON p.company_id = comp.id
      WHERE p.company_id = $1
      ORDER BY p.created_at DESC
    `
        : `
      SELECT 
        p.*,
        c.name as calendar_name,
        comp.name as company_name,
        c.semester,
        c.year
      FROM payments p
      LEFT JOIN calendar c ON p.calendar_id = c.id
      LEFT JOIN user_company comp ON p.company_id = comp.id
      ORDER BY p.created_at DESC
    `,
      companyId ? [parseInt(companyId)] : []
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// POST - สร้างข้อมูลการชำระเงินใหม่
export async function POST(request: NextRequest) {
  try {
    // TODO: เพิ่ม session authentication
    // const session = await getServerSession();
    // if (!session || session.user.userType !== "admin") {
    //   return NextResponse.json(
    //     { success: false, message: "ไม่มีสิทธิ์เข้าถึง" },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const {
      calendar_id,
      company_id,
      amount,
      detail,
      payment_date,
      file_attachment,
    } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!calendar_id) {
      return NextResponse.json(
        { success: false, message: "กรุณาเลือกปีการศึกษา" },
        { status: 400 }
      );
    }

    if (!company_id) {
      return NextResponse.json(
        { success: false, message: "กรุณาเลือกแหล่งฝึก" },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกจำนวนเงิน" },
        { status: 400 }
      );
    }

    if (!payment_date) {
      return NextResponse.json(
        { success: false, message: "กรุณาเลือกวันที่ชำระเงิน" },
        { status: 400 }
      );
    }

    // ตรวจสอบรูปแบบจำนวนเงิน
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(amount)) {
      return NextResponse.json(
        { success: false, message: "รูปแบบจำนวนเงินไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ตรวจสอบรูปแบบวันที่
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(payment_date)) {
      return NextResponse.json(
        { success: false, message: "รูปแบบวันที่ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // บันทึกข้อมูลการชำระเงินลงฐานข้อมูล
    const result = await sql(
      `
      INSERT INTO payments 
      (calendar_id, company_id, amount, detail, payment_date, file_attachment, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `,
      [
        parseInt(calendar_id),
        parseInt(company_id),
        parseFloat(amount),
        detail || null,
        payment_date,
        file_attachment || null,
      ]
    );

    const newPayment = result[0];

    console.log("Payment created:", newPayment);

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลการชำระเงินสำเร็จ",
      data: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทข้อมูลการชำระเงิน
export async function PUT(request: NextRequest) {
  try {
    // TODO: เพิ่ม session authentication
    // const session = await getServerSession();
    // if (!session || session.user.userType !== "admin") {
    //   return NextResponse.json(
    //     { success: false, message: "ไม่มีสิทธิ์เข้าถึง" },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const {
      id,
      calendar_id,
      company_id,
      amount,
      detail,
      payment_date,
      file_attachment,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ไม่พบ ID ของข้อมูลการชำระเงิน" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // อัพเดทข้อมูลการชำระเงินในฐานข้อมูล
    const result = await sql(
      `
      UPDATE payments 
      SET calendar_id = $1, company_id = $2, amount = $3, detail = $4, 
          payment_date = $5, file_attachment = $6
      WHERE id = $7
      RETURNING *
    `,
      [
        parseInt(calendar_id),
        parseInt(company_id),
        parseFloat(amount),
        detail || null,
        payment_date,
        file_attachment || null,
        parseInt(id),
      ]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการชำระเงินที่ต้องการอัพเดท" },
        { status: 404 }
      );
    }

    const updatedPayment = result[0];

    return NextResponse.json({
      success: true,
      message: "อัพเดทข้อมูลการชำระเงินสำเร็จ",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูลการชำระเงิน
export async function DELETE(request: NextRequest) {
  try {
    // TODO: เพิ่ม session authentication
    // const session = await getServerSession();
    // if (!session || session.user.userType !== "admin") {
    //   return NextResponse.json(
    //     { success: false, message: "ไม่มีสิทธิ์เข้าถึง" },
    //     { status: 401 }
    //   );
    // }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ไม่พบ ID ของข้อมูลการชำระเงิน" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // ลบข้อมูลการชำระเงินจากฐานข้อมูล
    const result = await sql(
      `
      DELETE FROM payments 
      WHERE id = $1
      RETURNING *
    `,
      [parseInt(id)]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการชำระเงินที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลการชำระเงินสำเร็จ",
      data: result[0],
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
