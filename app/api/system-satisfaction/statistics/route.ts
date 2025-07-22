import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET - ดึงสถิติและรายงานความพึงพอใจระบบ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get("company_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    // สร้าง WHERE clause
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];

    if (company_id) {
      whereClause += ` AND company_id = $${queryParams.length + 1}`;
      queryParams.push(parseInt(company_id));
    }

    if (start_date) {
      whereClause += ` AND created_at >= $${queryParams.length + 1}`;
      queryParams.push(start_date);
    }

    if (end_date) {
      whereClause += ` AND created_at <= $${queryParams.length + 1}`;
      queryParams.push(end_date);
    }

    // สถิติโดยรวม
    const overallStatsQuery = `
      SELECT 
        COUNT(*) as total_responses,
        ROUND(AVG(p1), 2) as avg_p1,
        ROUND(AVG(p2), 2) as avg_p2,
        ROUND(AVG(p3), 2) as avg_p3,
        ROUND(AVG(p4), 2) as avg_p4,
        ROUND(AVG(p5), 2) as avg_p5,
        ROUND(AVG(p6), 2) as avg_p6,
        ROUND(AVG(p7), 2) as avg_p7,
        ROUND(
          (COALESCE(AVG(p1), 0) + COALESCE(AVG(p2), 0) + COALESCE(AVG(p3), 0) + 
           COALESCE(AVG(p4), 0) + COALESCE(AVG(p5), 0) + COALESCE(AVG(p6), 0) + 
           COALESCE(AVG(p7), 0)) / 7, 2
        ) as overall_average,
        COUNT(CASE WHEN advice IS NOT NULL AND advice != '' THEN 1 END) as advice_count
      FROM system_satisfaction 
      ${whereClause}
    `;

    const overallStats = await sql(overallStatsQuery, queryParams);

    // สถิติแยกตามคะแนน (1-5) สำหรับแต่ละข้อ
    const scoreDistributionQuery = `
      SELECT 
        'p1' as question,
        COUNT(CASE WHEN p1 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p1 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p1 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p1 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p1 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p2' as question,
        COUNT(CASE WHEN p2 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p2 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p2 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p2 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p2 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p3' as question,
        COUNT(CASE WHEN p3 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p3 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p3 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p3 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p3 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p4' as question,
        COUNT(CASE WHEN p4 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p4 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p4 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p4 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p4 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p5' as question,
        COUNT(CASE WHEN p5 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p5 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p5 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p5 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p5 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p6' as question,
        COUNT(CASE WHEN p6 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p6 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p6 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p6 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p6 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      UNION ALL
      SELECT 
        'p7' as question,
        COUNT(CASE WHEN p7 = 1 THEN 1 END) as score_1,
        COUNT(CASE WHEN p7 = 2 THEN 1 END) as score_2,
        COUNT(CASE WHEN p7 = 3 THEN 1 END) as score_3,
        COUNT(CASE WHEN p7 = 4 THEN 1 END) as score_4,
        COUNT(CASE WHEN p7 = 5 THEN 1 END) as score_5
      FROM system_satisfaction ${whereClause}
      ORDER BY question
    `;

    const scoreDistribution = await sql(scoreDistributionQuery, queryParams);

    // สถิติแยกตามบริษัท (ถ้าไม่ระบุ company_id)
    let companyStats: any[] = [];
    if (!company_id) {
      const companyStatsQuery = `
        SELECT 
          c.id as company_id,
          c.name as company_name,
          COUNT(s.id) as total_responses,
          ROUND(
            (COALESCE(AVG(s.p1), 0) + COALESCE(AVG(s.p2), 0) + COALESCE(AVG(s.p3), 0) + 
             COALESCE(AVG(s.p4), 0) + COALESCE(AVG(s.p5), 0) + COALESCE(AVG(s.p6), 0) + 
             COALESCE(AVG(s.p7), 0)) / 7, 2
          ) as overall_average
        FROM companies c
        LEFT JOIN system_satisfaction s ON c.id = s.company_id
        ${whereClause.replace("WHERE 1=1", "WHERE c.id = s.company_id")}
        GROUP BY c.id, c.name
        HAVING COUNT(s.id) > 0
        ORDER BY overall_average DESC
      `;

      companyStats = await sql(companyStatsQuery, queryParams);
    }

    // ข้อเสนอแนะล่าสุด
    const recentAdviceQuery = `
      SELECT 
        s.id,
        s.advice,
        s.created_at,
        c.name as company_name
      FROM system_satisfaction s
      LEFT JOIN companies c ON s.company_id = c.id
      ${whereClause}
      AND s.advice IS NOT NULL 
      AND s.advice != ''
      ORDER BY s.created_at DESC
      LIMIT 10
    `;

    const recentAdvice = await sql(recentAdviceQuery, queryParams);

    return NextResponse.json({
      success: true,
      data: {
        overall_stats: overallStats[0],
        score_distribution: scoreDistribution,
        company_stats: companyStats,
        recent_advice: recentAdvice,
      },
    });
  } catch (error) {
    console.error("Error fetching system satisfaction statistics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
