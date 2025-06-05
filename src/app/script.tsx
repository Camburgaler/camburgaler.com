import dotenv from "dotenv";
dotenv.config();

import { remark } from "remark";
import html from "remark-html";
import LanguagesDisplay from "./lib/components/LanguagesDisplay";
import MarkdownRenderer from "./lib/components/MarkdownRenderer";
import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_LANGUAGES_PATH,
    GITHUB_METADATA_REPOS_PATH,
    REPO_NAME_TO_APP_NAME,
} from "./lib/constants";
import { CombinedMetadata } from "./lib/types/combinedMetadata";

export async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown);
    return result;
}

async function fetchGithubMetadata<T>(url: string): Promise<T> {
    const res = await fetch(
        `${GITHUB_METADATA_HOST}${url}`,
        process.env.NEXT_PUBLIC_GITHUB_PAT
            ? {
                  headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`,
                  },
              }
            : {}
    );
    return res.json();
}

async function fetchMetadata(repo: string): Promise<CombinedMetadata> {
    const res = await fetch(`/api/metadata?repo=${repo}`);
    return res.json();
}

export function retrieveMetadata(repo: string): Promise<CombinedMetadata> {
    return fetchMetadata(repo);
}

export function retrieveGithubRepoLanguages(
    user: string,
    repo: string
): Promise<Record<string, number>> {
    return fetchGithubMetadata<Record<string, number>>(
        `${GITHUB_METADATA_REPOS_PATH}/${user}/${repo}${GITHUB_METADATA_LANGUAGES_PATH}`
    );
}
function getAppName(metadata: CombinedMetadata, repoName: string) {
    return metadata.app_name ?? REPO_NAME_TO_APP_NAME.get(repoName);
}

function renderRepoTitle(repoMetadata: CombinedMetadata, repoName: string) {
    return repoMetadata ? (
        <h3>
            {repoMetadata.homepage ? (
                <a href={repoMetadata.homepage}>
                    {getAppName(repoMetadata, repoName)}
                </a>
            ) : (
                getAppName(repoMetadata, repoName) + " (WIP)"
            )}{" "}
            (<a href={repoMetadata.html_url}>source</a>)
        </h3>
    ) : (
        <h3 key={repoName}>
            {REPO_NAME_TO_APP_NAME.get(repoName)} (loading...)
        </h3>
    );
}

function getContrastingTextColor(bgColor: string) {
    // bgColor must be in hex format: "#RRGGBB"
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Calculate the relative luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Use white text for dark backgrounds, black text for light backgrounds
    return luminance > 186 ? "#000000" : "#FFFFFF";
}

function renderRepoDescription(repoMetadata: CombinedMetadata) {
    return repoMetadata && repoMetadata.description ? (
        <MarkdownRenderer content={repoMetadata.description} />
    ) : (
        <p>(description loading...)</p>
    );
}

export function renderRepoElements(
    repoName: string,
    repoMetadata: CombinedMetadata,
    repoLanguages: Record<string, number>
) {
    return (
        <div key={repoName}>
            {renderRepoTitle(repoMetadata, repoName)}
            <LanguagesDisplay repoLanguages={repoLanguages} />
            {renderRepoDescription(repoMetadata)}
        </div>
    );
}
