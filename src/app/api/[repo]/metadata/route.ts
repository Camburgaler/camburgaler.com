import dotenv from "dotenv";
dotenv.config();

import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_REPOS_PATH,
    GITHUB_USERNAME,
} from "@/app/lib/constants";
import { CombinedMetadata } from "@/app/lib/types/combinedMetadata";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_RAW_HOST = "https://raw.githubusercontent.com";
const METADATA_FILE_PATH = "metadata.json";
const GITHUB_DEFAULT_BRANCH = "master";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ repo: string }> }
) {
    const { repo } = await params;

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
