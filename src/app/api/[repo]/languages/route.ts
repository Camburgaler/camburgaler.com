import dotenv from "dotenv";
dotenv.config();

import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_REPOS_PATH,
    GITHUB_USERNAME,
} from "@camburgaler/latin-hypercube-shared";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_METADATA_LANGUAGES_PATH = "/languages";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ repo: string }> }
) {
    const { repo } = await params;

    const githubLanguagesUrl = `${GITHUB_METADATA_HOST}${GITHUB_METADATA_REPOS_PATH}/${GITHUB_USERNAME}/${repo}${GITHUB_METADATA_LANGUAGES_PATH}`;

    const githubLanguagesRes = await fetch(
        githubLanguagesUrl,
        process.env.NEXT_PUBLIC_GITHUB_PAT
            ? {
                  headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`,
                  },
              }
            : {}
    );

    const data: Record<string, number> = {
        ...(await githubLanguagesRes.json()),
    };
    return NextResponse.json(data);
}
