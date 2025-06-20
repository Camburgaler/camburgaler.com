import dotenv from "dotenv";
dotenv.config();

import { remark } from "remark";
import html from "remark-html";
import LanguagesDisplay from "./lib/components/LanguagesDisplay";
import MarkdownRenderer from "./lib/components/MarkdownRenderer";
import {
    REPO_NAME_DARK_SOULS_CHAR_SHEET,
    REPO_NAME_HALIGTREE,
    REPO_NAME_LATIN_HYPERCUBE_GENERATOR,
    REPO_NAME_SCOUNDREL,
} from "./lib/constants";
import { CombinedMetadata } from "./lib/types/combinedMetadata";

const APP_NAME_DARK_SOULS_CHAR_SHEET = "Dark Souls TTRPG Character Sheet";
const APP_NAME_SCOUNDREL = "Scoundrel";
const APP_NAME_HALIGTREE = "Haligtree";
const APP_NAME_LATIN_HYPERCUBE_GENERATOR = "CLI Latin Hypercube Point Sampler";
const REPO_NAME_TO_APP_NAME: Map<string, string> = new Map([
    [REPO_NAME_DARK_SOULS_CHAR_SHEET, APP_NAME_DARK_SOULS_CHAR_SHEET],
    [REPO_NAME_SCOUNDREL, APP_NAME_SCOUNDREL],
    [REPO_NAME_HALIGTREE, APP_NAME_HALIGTREE],
    [REPO_NAME_LATIN_HYPERCUBE_GENERATOR, APP_NAME_LATIN_HYPERCUBE_GENERATOR],
]);

export async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown);
    return result;
}

export async function fetchMetadata(repo: string): Promise<CombinedMetadata> {
    const res = await fetch(`/api/${repo}/metadata`);
    return res.json();
}

export async function fetchLanguages(
    repo: string
): Promise<Record<string, number>> {
    const res = await fetch(`/api/${repo}/languages`);
    return res.json();
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
