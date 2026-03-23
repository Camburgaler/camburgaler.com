import dotenv from "dotenv";
dotenv.config();

import { GithubMetadata } from "@/app/lib/types/githubMetadata";
import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_REPOS_PATH,
    GITHUB_USERNAME,
} from "@camburgaler/latin-hypercube-shared";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ repo: string }> },
): Promise<NextResponse<GithubMetadata>> {
    const { repo } = await params;

    const githubMetadataUrl = `${GITHUB_METADATA_HOST}${GITHUB_METADATA_REPOS_PATH}/${GITHUB_USERNAME}/${repo}`;

    const githubMetadataRes = await fetch(
        githubMetadataUrl,
        process.env.GITHUB_PAT
            ? {
                  headers: {
                      Authorization: `Bearer ${process.env.GITHUB_PAT}`,
                  },
              }
            : {},
    );

    const data: GithubMetadata = {
        ...(await githubMetadataRes.json()),
    };
    return NextResponse.json(data);
}
