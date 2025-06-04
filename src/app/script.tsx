import dotenv from "dotenv";
dotenv.config();

import yaml from "js-yaml";
import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_LANGUAGES_PATH,
    GITHUB_METADATA_REPOS_PATH,
    REPO_NAME_TO_APP_NAME,
} from "./lib/constants";
import { CombinedMetadata } from "./lib/types/combinedMetadata";

const languageColors = yaml.load(
    await fetch(
        "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
    ).then((res) => res.text())
) as Record<string, { color: string }>;

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
                getAppName(repoMetadata, repoName)
            )}{" "}
            (<a href={repoMetadata.html_url}>source</a>)
        </h3>
    ) : (
        <h3 key={repoName}>
            {REPO_NAME_TO_APP_NAME.get(repoName)} (loading...)
        </h3>
    );
}

function renderLanguageSpans(repoLanguages: Record<string, number>) {
    return (
        <span style={{ width: "100%", display: "flex", height: "10px" }}>
            {Object.entries(repoLanguages)
                .sort((a, b) => b[1] - a[1])
                .map(([lang, count]) => (
                    <span
                        key={lang}
                        style={{
                            backgroundColor: languageColors[lang].color,
                            width: `${
                                (count /
                                    Object.values(repoLanguages).reduce(
                                        (a, b) => a + b,
                                        0
                                    )) *
                                100
                            }%`,
                            borderRadius: "10px",
                            height: "auto",
                            fontSize: "1rem",
                            transition: "all 0.5s ease-in-out",
                            color: "var(--font)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.textContent = `${lang}: ${count}`;
                            e.currentTarget.style.height = "1.5rem";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.textContent = "";
                            e.currentTarget.style.height = "auto";
                        }}
                    ></span>
                ))}
        </span>
    );
}

function renderRepoLanguages(repoLanguages: Record<string, number>) {
    return repoLanguages && languageColors
        ? renderLanguageSpans(repoLanguages)
        : `(languages loading...)`;
}

function renderRepoDescription(repoMetadata: CombinedMetadata) {
    return repoMetadata ? (
        <p>{repoMetadata.description}</p>
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
            {renderRepoLanguages(repoLanguages)}
            {renderRepoDescription(repoMetadata)}
        </div>
    );
}
