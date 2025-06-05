import dotenv from "dotenv";
dotenv.config();

import {
    GITHUB_DEFAULT_BRANCH,
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_REPOS_PATH,
    GITHUB_RAW_HOST,
    GITHUB_USERNAME,
    METADATA_FILE_PATH,
} from "@/app/lib/constants";
import { CombinedMetadata } from "@/app/lib/types/combinedMetadata";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const repo = req.nextUrl.searchParams.get("repo");
    if (!repo)
        return NextResponse.json(
            { error: "Missing repo name" },
            { status: 400 }
        );

    const githubMetadataUrl = `${GITHUB_METADATA_HOST}${GITHUB_METADATA_REPOS_PATH}/${GITHUB_USERNAME}/${repo}`;
    const customMetadataUrl = `${GITHUB_RAW_HOST}/${GITHUB_USERNAME}/${repo}/${GITHUB_DEFAULT_BRANCH}/${METADATA_FILE_PATH}`;

    const githubMetadataRes = await fetch(
        githubMetadataUrl,
        process.env.NEXT_PUBLIC_GITHUB_PAT
            ? {
                  headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`,
                  },
              }
            : {}
    );
    const customMetadataRes = await fetch(
        customMetadataUrl,
        process.env.NEXT_PUBLIC_GITHUB_PAT
            ? {
                  headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`,
                  },
              }
            : {}
    );

    const data: CombinedMetadata = {
        ...(await githubMetadataRes.json()),
        ...(customMetadataRes.ok ? await customMetadataRes.json() : {}),
    };
    return NextResponse.json(data);
}
