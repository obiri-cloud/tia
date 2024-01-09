import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let key = searchParams.get("key");
  const data = await poll(key);
  return NextResponse.json({ data });
}

const poll = async (key: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/callback/?key=${key}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // Authorization: `Bearer ${token}`
    },
  });
  const data = await res.json();
  return data;
};
