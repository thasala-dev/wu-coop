# System Satisfaction API Documentation

API สำหรับจัดการข้อมูลแบบประเมินความพึงพอใจระบบ

## Base URL

```
/api/system-satisfaction
```

## Endpoints

### 1. GET /api/system-satisfaction

ดึงรายการข้อมูลแบบประเมินความพึงพอใจระบบ

**Query Parameters:**

- `page` (optional): หน้าที่ต้องการ (default: 1)
- `limit` (optional): จำนวนรายการต่อหน้า (default: 10)
- `search` (optional): ค้นหาในข้อเสนอแนะ
- `company_id` (optional): กรองตาม ID บริษัท

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "p1": 4,
      "p2": 5,
      "p3": 3,
      "p4": 4,
      "p5": 5,
      "p6": 4,
      "p7": 3,
      "advice": "ระบบใช้งานได้ดี",
      "company_id": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. POST /api/system-satisfaction

เพิ่มข้อมูลแบบประเมินความพึงพอใจระบบใหม่

**Request Body:**

```json
{
  "p1": 4,
  "p2": 5,
  "p3": 3,
  "p4": 4,
  "p5": 5,
  "p6": 4,
  "p7": 3,
  "advice": "ระบบใช้งานได้ดี มีการปรับปรุงเรื่องการแสดงผลให้ดีขึ้น",
  "company_id": 1
}
```

**Validation Rules:**

- `p1-p7`: คะแนน 1-5 (optional)
- `advice`: ข้อเสนอแนะ (optional)
- `company_id`: ID บริษัท (required)

### 3. GET /api/system-satisfaction/[id]

ดึงข้อมูลแบบประเมินความพึงพอใจระบบตาม ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "p1": 4,
    "p2": 5,
    "p3": 3,
    "p4": 4,
    "p5": 5,
    "p6": 4,
    "p7": 3,
    "advice": "ระบบใช้งานได้ดี",
    "company_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "company_name": "บริษัท ABC จำกัด"
  }
}
```

### 4. PUT /api/system-satisfaction/[id]

แก้ไขข้อมูลแบบประเมินความพึงพอใจระบบ

**Request Body:**

```json
{
  "p1": 5,
  "p2": 5,
  "p3": 4,
  "p4": 4,
  "p5": 5,
  "p6": 4,
  "p7": 4,
  "advice": "ระบบใช้งานได้ดีมาก ปรับปรุงแล้ว",
  "company_id": 1
}
```

### 5. DELETE /api/system-satisfaction/[id]

ลบข้อมูลแบบประเมินความพึงพอใจระบบ

**Response:**

```json
{
  "success": true,
  "message": "System satisfaction deleted successfully"
}
```

### 6. GET /api/system-satisfaction/statistics

ดึงสถิติและรายงานความพึงพอใจระบบ

**Query Parameters:**

- `company_id` (optional): กรองตาม ID บริษัท
- `start_date` (optional): วันที่เริ่มต้น (YYYY-MM-DD)
- `end_date` (optional): วันที่สิ้นสุด (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "overall_stats": {
      "total_responses": 25,
      "avg_p1": 4.2,
      "avg_p2": 4.5,
      "avg_p3": 3.8,
      "avg_p4": 4.1,
      "avg_p5": 4.3,
      "avg_p6": 4.0,
      "avg_p7": 3.9,
      "overall_average": 4.11,
      "advice_count": 20
    },
    "score_distribution": [
      {
        "question": "p1",
        "score_1": 0,
        "score_2": 2,
        "score_3": 5,
        "score_4": 12,
        "score_5": 6
      }
    ],
    "company_stats": [
      {
        "company_id": 1,
        "company_name": "บริษัท ABC จำกัด",
        "total_responses": 5,
        "overall_average": 4.5
      }
    ],
    "recent_advice": [
      {
        "id": 25,
        "advice": "ระบบใช้งานได้ดี",
        "created_at": "2024-01-15T10:30:00Z",
        "company_name": "บริษัท ABC จำกัด"
      }
    ]
  }
}
```

## คำอธิบายคะแนนประเมิน

คะแนนแต่ละข้อ (p1-p7) มีความหมายดังนี้:

- **p1**: ความพึงพอใจโดยรวมของระบบ
- **p2**: ความง่ายในการใช้งาน
- **p3**: ความเร็วในการตอบสนอง
- **p4**: การออกแบบหน้าตาระบบ
- **p5**: ความถูกต้องของข้อมูล
- **p6**: ความปลอดภัยของระบบ
- **p7**: การสนับสนุนและช่วยเหลือ

**ระดับคะแนน:**

- 1 = ไม่พอใจมาก
- 2 = ไม่พอใจ
- 3 = ปานกลาง
- 4 = พอใจ
- 5 = พอใจมาก

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Company ID is required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "System satisfaction not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to fetch system satisfaction data"
}
```

## Usage Examples

### สร้างแบบประเมินใหม่

```javascript
const response = await fetch("/api/system-satisfaction", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    p1: 4,
    p2: 5,
    p3: 3,
    p4: 4,
    p5: 5,
    p6: 4,
    p7: 3,
    advice: "ระบบใช้งานได้ดี",
    company_id: 1,
  }),
});
```

### ดึงสถิติของบริษัทเฉพาะ

```javascript
const response = await fetch(
  "/api/system-satisfaction/statistics?company_id=1&start_date=2024-01-01&end_date=2024-12-31"
);
```

### ค้นหาและแบ่งหน้า

```javascript
const response = await fetch(
  "/api/system-satisfaction?page=1&limit=20&search=ระบบ&company_id=1"
);
```
