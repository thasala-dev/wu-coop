import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export type Role = "student" | "mentor" | "advisor" | "admin";

export interface SessionUser {
  id: number | string;
  role: Role;
  [key: string]: any;
}

const SECRET =
  process.env.NEXTAUTH_SECRET ||
  "your-secret-key-change-this-in-production";

export async function requireSession(
  req: Request
): Promise<SessionUser | NextResponse> {
  const token = await getToken({ req: req as any, secret: SECRET });
  if (!token?.role) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  return {
    id: (token.id as any) ?? (token.user as any)?.id,
    role: token.role as Role,
    ...((token.user as any) || {}),
  };
}

export async function requireRole(
  req: Request,
  roles: Role[]
): Promise<SessionUser | NextResponse> {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  if (!roles.includes(session.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }
  return session;
}
