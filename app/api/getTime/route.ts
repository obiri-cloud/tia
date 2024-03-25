import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const data = await getTime();
  return NextResponse.json(data);
}

const getTime = async () => {
  const timestamp = new Date().getTime();
  
  const url = `https://worldtimeapi.org/api/ip?timestamp=${timestamp}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();

  return data;
};
