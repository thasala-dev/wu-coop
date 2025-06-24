import "next-auth";

declare module "next-auth" {
  /**
   * เพิ่ม properties เข้าไปใน Session
   */
  interface Session {
    user: {
      id: number;
      role: string;
      name?: string;
      fullname?: string;
      email?: string;
      lastLogin?: string;
      // เพิ่ม properties อื่นๆ ตามต้องการ
      [key: string]: any;
    };
  }

  /**
   * เพิ่ม properties เข้าไปใน User
   */
  interface User {
    id: number;
    role: string;
    name?: string;
    fullname?: string;
    email?: string;
    lastLogin?: string;
    // เพิ่ม properties อื่นๆ ตามต้องการ
    [key: string]: any;
  }
}

declare module "next-auth/jwt" {
  /**
   * เพิ่ม properties เข้าไปใน JWT
   */
  interface JWT {
    id: number;
    role: string;
    user: {
      id: number;
      role: string;
      name?: string;
      fullname?: string;
      email?: string;
      lastLogin?: string;
      // เพิ่ม properties อื่นๆ ตามต้องการ
      [key: string]: any;
    };
  }
}
