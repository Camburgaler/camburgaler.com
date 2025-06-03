import dotenv from "dotenv";
dotenv.config();

import yaml from "js-yaml";
import {
    GITHUB_METADATA_HOST,
    GITHUB_METADATA_LANGUAGES_PATH,
    GITHUB_METADATA_REPOS_PATH,
    REPO_NAME_TO_APP_NAME,
} from "./lib/constants";
import { GithubRepo } from "./lib/types/githubRepo";

const languageColors = yaml.load(
    await fetch(
        "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
    ).then((res) => res.text())
) as Record<string, { color: string }>;

async function retrieveGithubMetadata<T>(url: string): Promise<T> {
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

export function retrieveGithubRepoMetadata(
    user: string,
    repo: string
): Promise<GithubRepo> {
    return retrieveGithubMetadata<GithubRepo>(
        `${GITHUB_METADATA_REPOS_PATH}/${user}/${repo}`
    );
}

export function retrieveGithubRepoLanguages(
    user: string,
    repo: string
): Promise<Record<string, number>> {
    return retrieveGithubMetadata<Record<string, number>>(
        `${GITHUB_METADATA_REPOS_PATH}/${user}/${repo}${GITHUB_METADATA_LANGUAGES_PATH}`
    );
}

export function renderRepoElements(
    repoName: string,
    repoMetadata: GithubRepo,
    repoLanguages: Record<string, number>
) {
    return (
        <div key={repoName}>
            {" "}
            {repoMetadata ? (
                <h3>
                    {repoMetadata.homepage ? (
                        <a href={repoMetadata.homepage}>
                            {REPO_NAME_TO_APP_NAME.get(repoName)}
                        </a>
                    ) : (
                        REPO_NAME_TO_APP_NAME.get(repoName)
                    )}{" "}
                    (<a href={repoMetadata.html_url}>source</a>)
                </h3>
            ) : (
                <h3 key={repoName}>
                    {REPO_NAME_TO_APP_NAME.get(repoName)} (loading...)
                </h3>
            )}
            {repoLanguages && languageColors
                ? renderLanguageSpans(repoLanguages)
                : `(languages loading...)`}
        </div>
    );
}

export function renderLanguageSpans(repoLanguages: Record<string, number>) {
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
