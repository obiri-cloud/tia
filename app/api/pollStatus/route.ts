import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let key = searchParams.get("key");
  let token = searchParams.get("token");
  const data = await pollStatus(key, token);
  return NextResponse.json({ data });
}



const pollStatus = async (key: string | null, token: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/status/?lab_status_key=${key}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  const data = await res.json();
  
  return data;
};
