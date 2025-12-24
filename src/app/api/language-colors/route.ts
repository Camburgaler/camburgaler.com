// Accept a GET request and return the language-colors.json file
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest
): Promise<NextResponse<Record<string, string>>> {
    const data = readFileSync("language-colors.json", "utf-8");
    return NextResponse.json(JSON.parse(data));
}
