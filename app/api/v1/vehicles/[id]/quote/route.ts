import { API } from "@/server/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!startDate) {
      return NextResponse.json(
        { error: "No start date provided" },
        { status: 400 },
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { error: "No end date provided" },
        { status: 400 },
      );
    }

    const quote = await API.getQuote({
      vehicleId: id,
      startTime: startDate,
      endTime: endDate,
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Unable to process quote" },
        { status: 404 },
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
