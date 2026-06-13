import { NextResponse } from "next/server";
import { API } from "@/server/api";

export async function GET() {
  try {
    const vehicles = await API.searchVehicles();

    if (!vehicles) {
      return NextResponse.json({ error: "No vehicles found" }, { status: 404 });
    }

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
