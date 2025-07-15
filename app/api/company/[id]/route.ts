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
      const companyData = { ...data[0] };

      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: companyData,
      });
    }
  } catch (error) {
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
    console.log("PUT company ID:", id, "with body:", body);

    const sql = neon(`${process.env.DATABASE_URL}`);

    const updateFields = [];
    const params = [id];
    let paramCount = 2;

    // Add fields that are present in the request body
    if (body.name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      params.push(body.name);
    }
    if (body.businessType !== undefined) {
      updateFields.push(`business_type = $${paramCount++}`);
      params.push(body.businessType);
    }
    if (body.location !== undefined) {
      updateFields.push(`location = $${paramCount++}`);
      params.push(body.location);
    }
    if (body.establishYear !== undefined) {
      updateFields.push(`establish_year = $${paramCount++}`);
      params.push(body.establishYear || null);
    }
    if (body.totalEmployees !== undefined) {
      updateFields.push(`total_employees = $${paramCount++}`);
      params.push(body.totalEmployees || null);
    }
    if (body.joinedYear !== undefined) {
      updateFields.push(`joined_year = $${paramCount++}`);
      params.push(body.joinedYear || null);
    }
    if (body.website !== undefined) {
      updateFields.push(`website = $${paramCount++}`);
      params.push(body.website || null);
    }
    if (body.contactName !== undefined) {
      updateFields.push(`contact_name = $${paramCount++}`);
      params.push(body.contactName);
    }
    if (body.contactPosition !== undefined) {
      updateFields.push(`contact_position = $${paramCount++}`);
      params.push(body.contactPosition);
    }
    if (body.contactEmail !== undefined) {
      updateFields.push(`contact_email = $${paramCount++}`);
      params.push(body.contactEmail || null);
    }
    if (body.contactPhone !== undefined) {
      updateFields.push(`contact_phone = $${paramCount++}`);
      params.push(body.contactPhone || null);
    }
    if (body.contactAddress !== undefined) {
      updateFields.push(`contact_address = $${paramCount++}`);
      params.push(body.contactAddress || null);
    }
    if (body.detail !== undefined) {
      updateFields.push(`detail = $${paramCount++}`);
      params.push(body.detail || null);
    }
    if (body.image !== undefined) {
      updateFields.push(`image = $${paramCount++}`);
      params.push(body.image || null);
    }

    if (body.username !== undefined) {
      updateFields.push(`username = $${paramCount++}`);
      params.push(body.username);
    }

    if (body.password !== undefined) {
      updateFields.push(`password_hash = $${paramCount++}`);
      params.push(body.password);
    }
    if (body.evaluationType !== undefined) {
      updateFields.push(`evaluation_type = $${paramCount++}`);
      params.push(body.evaluationType || []);
    }

    if (body.bankName !== undefined) {
      updateFields.push(`bank_name = $${paramCount++}`);
      params.push(body.bankName);
    }

    if (body.bankAccount !== undefined) {
      updateFields.push(`bank_account = $${paramCount++}`);
      params.push(body.bankAccount);
    }

    if (body.bookbankFile !== undefined) {
      updateFields.push(`bookbank_file = $${paramCount++}`);
      params.push(body.bookbankFile);
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // If no fields to update, return
    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลที่จะอัปเดต" },
        { status: 400 }
      );
    }

    const query = `UPDATE user_company SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;

    const data = await sql(query, params);

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Soft delete: Set flag_del = 1 instead of removing the record
    const data = await sql(
      `UPDATE user_company SET flag_del = 1 WHERE id = $1 RETURNING *`,
      [id]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
