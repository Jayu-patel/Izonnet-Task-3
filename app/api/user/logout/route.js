import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { expires: new Date(0) });
  cookieStore.set("jwtAdmin", "", { expires: new Date(0) });

  return NextResponse.json({message: "Cookie cleared"}, {status: 200})
}
