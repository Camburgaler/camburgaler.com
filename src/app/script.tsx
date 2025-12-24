import dotenv from "dotenv";
dotenv.config();

import { REPO_NAME_LATIN_HYPERCUBE_GENERATOR } from "@camburgaler/latin-hypercube-shared";
import { JSX } from "react";
import LanguagesDisplay from "./lib/components/LanguagesDisplay";
import {
    REPO_NAME_DARK_SOULS_CHAR_SHEET,
    REPO_NAME_HALIGTREE,
    REPO_NAME_SCOUNDREL,
} from "./lib/constants";
import { GithubMetadata } from "./lib/types/githubMetadata";

const APP_NAME_DARK_SOULS_CHAR_SHEET = "Dark Souls TTRPG Character Sheet";
const APP_NAME_SCOUNDREL = "Scoundrel";
const APP_NAME_HALIGTREE = "Haligtree";
const APP_NAME_LATIN_HYPERCUBE_GENERATOR = "CLI Latin Hypercube Point Sampler";

const DESCRIPTION_DARK_SOULS_CHAR_SHEET = (
    <p>
        There was an expansion released for Dungeons & Dragons Fifth Edition
        that added rules for running games set in the Dark Souls universe.
        Unfortunately, the character sheet that was published alongside it was
        subpar. I am working on an interactive version of the character sheet
        that will make playing the expansion much more convenient.
    </p>
);
const DESCRIPTION_SCOUNDREL = (
    <p>
        This is a roguelike dungeon-crawler card game called Scoundrel. It is
        written in Svelte and TypeScript. With this project, I was specifically
        trying to broaden my experience by using tools I was unfamiliar with. I
        chose Svelte for this reason, as well as Svelte being useful for easily
        animating the UI. Additionally, I got some experience storing and
        serving static assets, by writing asset metadata to a database,
        retrieving the metadata at runtime, then using that metadata to
        determine what assets are needed and from where to retrieve them.
    </p>
);
const DESCRIPTION_HALIGTREE = (
    <p>
        Forked from another project that was written in CommonJS, this version
        is rewritten from scratch in Next.JS, includes more features, and gained
        some optimizations. It exists to assist in planning and optimizing
        character builds in Elden Ring. There are three main pages: a class
        selector, an armor optimizer, and a weapon finder. The class selector
        finds the optimal starting class for your build. The armor optimizer
        displays the three best armor sets within your equip load budget, and
        does so with an efficient knapsack algorithm. The weapon finder allows
        you to filter weapons and ranks them based on damage output. To see my
        future plans for this app, please see the{" "}
        <a href="https://github.com/Camburgaler/haligtree/issues">
            Github issues
        </a>{" "}
        page.
    </p>
);
const DESCRIPTION_LATIN_HYPERCUBE_GENERATOR = (
    <p>
        An excerpt from the{" "}
        <a href="https://en.wikipedia.org/wiki/Latin_hypercube_sampling#cite_note-C3M-1">
            Wikipedia article on latin hypercube sampling
        </a>
        : "Latin hypercube sampling (LHS) is a statistical method for generating
        a near-random sample of parameter values from a multidimensional
        distribution. The sampling method is often used to construct computer
        experiments or for Monte Carlo integration." This project was written
        during a summer internship that I did for TechSource, Inc., an
        LANL-adjacent company in Los Alamos, New Mexico. I needed to better
        understand Monte Carlo integration, and this helped to facilitate that.
        Since then, I have updated the project to be more accessible and easier
        to use. The demo allows you to select the configurations for producing
        LHC samples, visualizes the results, and allows you to download the CSV
        output.
    </p>
);

const REPO_NAME_TO_APP_NAME: Map<string, string> = new Map([
    [REPO_NAME_DARK_SOULS_CHAR_SHEET, APP_NAME_DARK_SOULS_CHAR_SHEET],
    [REPO_NAME_SCOUNDREL, APP_NAME_SCOUNDREL],
    [REPO_NAME_HALIGTREE, APP_NAME_HALIGTREE],
    [REPO_NAME_LATIN_HYPERCUBE_GENERATOR, APP_NAME_LATIN_HYPERCUBE_GENERATOR],
]);
const REPO_NAME_TO_DESCRIPTION: Map<string, JSX.Element> = new Map([
    [REPO_NAME_DARK_SOULS_CHAR_SHEET, DESCRIPTION_DARK_SOULS_CHAR_SHEET],
    [REPO_NAME_SCOUNDREL, DESCRIPTION_SCOUNDREL],
    [REPO_NAME_HALIGTREE, DESCRIPTION_HALIGTREE],
    [
        REPO_NAME_LATIN_HYPERCUBE_GENERATOR,
        DESCRIPTION_LATIN_HYPERCUBE_GENERATOR,
    ],
]);

export async function fetchLanguageColors(): Promise<Record<string, string>> {
    const res = await fetch("/api/language-colors");
    return res.json();
}

export async function fetchMetadata(repo: string): Promise<GithubMetadata> {
    const res = await fetch(`/api/${repo}/metadata`);
    return res.json();
}

export async function fetchLanguages(
    repo: string
): Promise<Record<string, number>> {
    const res = await fetch(`/api/${repo}/languages`);
    return res.json();
}

function getAppName(repoName: string) {
    return REPO_NAME_TO_APP_NAME.get(repoName);
}

function renderRepoTitle(repoMetadata: GithubMetadata, repoName: string) {
    return repoMetadata ? (
        <h3>
            {repoMetadata.homepage ? (
                <a href={repoMetadata.homepage}>{getAppName(repoName)}</a>
            ) : (
                getAppName(repoName) + " (WIP)"
            )}{" "}
            (<a href={repoMetadata.html_url}>source</a>)
        </h3>
    ) : (
        <h3 key={repoName}>{getAppName(repoName)} (loading...)</h3>
    );
}

function renderRepoDescription(repoMetadata: GithubMetadata) {
    return repoMetadata && repoMetadata.name ? (
        REPO_NAME_TO_DESCRIPTION.get(repoMetadata.name)
    ) : (
        <p>(description loading...)</p>
    );
}

export function renderRepoElements(
    repoName: string,
    repoMetadata: GithubMetadata,
    repoLanguages: Record<string, number>,
    languageColors: Record<string, string>
) {
    return (
        <div key={repoName}>
            {renderRepoTitle(repoMetadata, repoName)}
            <LanguagesDisplay
                repoLanguages={repoLanguages}
                languageColors={languageColors}
            />
            {renderRepoDescription(repoMetadata)}
        </div>
    );
}
