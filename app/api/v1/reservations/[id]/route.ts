import { API } from "@/server/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    const reservation = await API.getReservation(id);

    if (!reservation) {
      return NextResponse.json(
        { error: "No reservation found" },
        { status: 404 },
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
