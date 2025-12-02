import { NextResponse } from "next/server";
import { AdminModel } from "@/lib/admin/admin.model";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const isValid = AdminModel.validateCredentials(username, password);

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Invalid admin credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Admin login successful"
  });
}
