import { NextResponse } from "next/server";
import { API } from "@/server/api";

export async function GET() {
  try {
    const addOns = await API.fetchAddOns();

    if (!addOns) {
      return NextResponse.json({ error: "No add-ons found" }, { status: 404 });
    }

    return NextResponse.json(addOns);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
