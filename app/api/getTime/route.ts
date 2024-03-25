import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const data = await getTime();
  return NextResponse.json(data);
}

const getTime = async () => {
  const timestamp = new Date().getTime();
  console.log("timestamp", timestamp);
  
  const url = `https://worldtimeapi.org/api/ip?timestamp=${timestamp}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  console.log("data", data);

  return data;
};
