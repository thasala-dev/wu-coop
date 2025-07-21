# News API Documentation

## Endpoints

### 1. GET /api/news - รายการข่าวสาร

**Query Parameters:**

- `page` (optional): หน้าที่ต้องการ (default: 1)
- `pageSize` (optional): จำนวนรายการต่อหน้า (default: 10)
- `search` (optional): ค้นหาจากชื่อเรื่องหรือรายละเอียด
- `status` (optional): กรองตามสถานะ (0 = ปิดใช้งาน, 1 = เปิดใช้งาน, "all" = ทั้งหมด)

**Example:**

```
GET /api/news?page=1&pageSize=10&search=ประกาศ&status=1
```

**Response:**

```json
{
  "success": true,
  "message": "ดำเนินการสำเร็จ",
  "data": {
    "news": [
      {
        "id": 1,
        "title": "ประกาศเรื่องการฝึกงาน",
        "detail": "รายละเอียดของประกาศ...",
        "status": 1,
        "news_date": "2024-01-15",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 2. POST /api/news - เพิ่มข่าวสารใหม่

**Request Body:**

```json
{
  "title": "ชื่อเรื่องข่าวสาร",
  "detail": "รายละเอียดของข่าวสาร",
  "status": 1,
  "news_date": "2024-01-15"
}
```

**Response:**

```json
{
  "success": true,
  "message": "เพิ่มข่าวสารเรียบร้อยแล้ว",
  "data": {
    "id": 1,
    "title": "ชื่อเรื่องข่าวสาร",
    "detail": "รายละเอียดของข่าวสาร",
    "status": 1,
    "news_date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. GET /api/news/[id] - ดูข่าวสารตาม ID

**Example:**

```
GET /api/news/1
```

**Response:**

```json
{
  "success": true,
  "message": "ดำเนินการสำเร็จ",
  "data": {
    "id": 1,
    "title": "ชื่อเรื่องข่าวสาร",
    "detail": "รายละเอียดของข่าวสาร",
    "status": 1,
    "news_date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. PUT /api/news/[id] - แก้ไขข่าวสาร

**Request Body:**

```json
{
  "title": "ชื่อเรื่องข่าวสารที่แก้ไข",
  "detail": "รายละเอียดที่แก้ไข",
  "status": 1,
  "news_date": "2024-01-16"
}
```

**Response:**

```json
{
  "success": true,
  "message": "แก้ไขข่าวสารเรียบร้อยแล้ว",
  "data": {
    "id": 1,
    "title": "ชื่อเรื่องข่าวสารที่แก้ไข",
    "detail": "รายละเอียดที่แก้ไข",
    "status": 1,
    "news_date": "2024-01-16",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T09:15:00Z"
  }
}
```

### 5. DELETE /api/news/[id] - ลบข่าวสาร

**Example:**

```
DELETE /api/news/1
```

**Response:**

```json
{
  "success": true,
  "message": "ลบข่าวสารเรียบร้อยแล้ว",
  "data": {
    "id": 1,
    "title": "ชื่อเรื่องข่าวสารที่ถูกลบ"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "กรุณาระบุชื่อเรื่อง"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "ไม่พบข่าวสารที่ระบุ"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "เกิดข้อผิดพลาดในการดำเนินการ",
  "error": "Error message"
}
```

## Status Codes

- `0` = ปิดใช้งาน (ไม่แสดงบนเว็บไซต์)
- `1` = เปิดใช้งาน (แสดงบนเว็บไซต์)

## Frontend Usage Examples

### การดึงรายการข่าวสาร

```javascript
const fetchNews = async (page = 1, search = "", status = "all") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: "10",
      search,
      status,
    });

    const response = await fetch(`/api/news?${params}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
```

### การเพิ่มข่าวสารใหม่

```javascript
const createNews = async (newsData) => {
  try {
    const response = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsData),
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};
```

### การแก้ไขข่าวสาร

```javascript
const updateNews = async (id, newsData) => {
  try {
    const response = await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsData),
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};
```

### การลบข่าวสาร

```javascript
const deleteNews = async (id) => {
  try {
    const response = await fetch(`/api/news/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};
```
