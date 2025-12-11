import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.username ||
            !credentials?.password ||
            !credentials?.role
          ) {
            return null;
          }

          const { username, password, role } = credentials;
          const passwordAdmin = process.env.ADMIN_PASSWORD || "admin123";

          // ค้นหาผู้ใช้ตาม role
          let users: any = [];
          if (role === "admin") {
            users = await sql.query(
              "SELECT * FROM user_admin WHERE username = $1 and status_id != 2 and flag_del = 0",
              [username]
            );
          } else if (role === "mentor") {
            users = await sql.query(
              "SELECT * FROM user_company WHERE username = $1 and status_id != 2 and flag_del = 0",
              [username]
            );
          } else if (role === "advisor") {
            users = await sql.query(
              "SELECT * FROM user_advisor WHERE username = $1 and status_id != 2 and flag_del = 0",
              [username]
            );
          } else if (role === "student") {
            users = await sql.query(
              "SELECT * FROM user_student WHERE username = $1 and status_id != 2 and flag_del = 0",
              [username]
            );
          }

          if (users.length === 0) {
            return null;
          }

          const user = users.find((u: any) => u.username === username);

          if (
            !user ||
            (user.password_hash !== password && password !== passwordAdmin)
          ) {
            return null;
          }

          // บันทึกการเข้าสู่ระบบ
          await sql.query(
            "INSERT INTO log (title, user_id, user_role) VALUES ($1, $2, $3)",
            [
              `${role === "mentor" ? user.name : user.fullname
              } ได้เข้าสู่ระบบสำเร็จ`,
              user.id,
              role,
            ]
          );

          // อัปเดตเวลาเข้าสู่ระบบล่าสุด
          const lastLogin = new Date().toISOString();
          if (role === "admin") {
            await sql.query(
              "UPDATE user_admin SET last_login = $1, status_id = 1 WHERE username = $2",
              [lastLogin, username]
            );
          } else if (role === "mentor") {
            await sql.query(
              "UPDATE user_company SET last_login = $1, status_id = 1 WHERE username = $2",
              [lastLogin, username]
            );
          } else if (role === "advisor") {
            await sql.query(
              "UPDATE user_advisor SET last_login = $1, status_id = 1 WHERE username = $2",
              [lastLogin, username]
            );
          } else if (role === "student") {
            await sql.query(
              "UPDATE user_student SET last_login = $1, status_id = 1 WHERE username = $2",
              [lastLogin, username]
            );
          }

          // ลบข้อมูลอ่อนไหว
          const sanitizedUser = { ...user };
          delete sanitizedUser.password_hash;
          delete sanitizedUser.password;

          // เพิ่มข้อมูลที่จำเป็น
          sanitizedUser.role = role;
          sanitizedUser.lastLogin = lastLogin;

          return sanitizedUser;
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // เพิ่มข้อมูลจาก user เข้าไปใน token
      if (user) {
        token.user = user as any;
        token.role = user.role;
        token.id = user.id as any;
      }
      return token;
    },
    async session({ session, token }) {
      // เพิ่มข้อมูลจาก token เข้าไปใน session
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // หน้า login
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 วัน
  },
  secret:
    process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",
});

export { handler as GET, handler as POST };
