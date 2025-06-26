"use client";

import { REPO_NAME_LATIN_HYPERCUBE_GENERATOR } from "@camburgaler/latin-hypercube-shared";
import { JSX, useEffect, useState } from "react";
import {
    REPO_NAME_DARK_SOULS_CHAR_SHEET,
    REPO_NAME_HALIGTREE,
    REPO_NAME_SCOUNDREL,
} from "./lib/constants";
import { CombinedMetadata } from "./lib/types/combinedMetadata";
import { fetchLanguages, fetchMetadata, renderRepoElements } from "./script";

const GITHUB_REPOS = [
    REPO_NAME_DARK_SOULS_CHAR_SHEET,
    REPO_NAME_SCOUNDREL,
    REPO_NAME_HALIGTREE,
    REPO_NAME_LATIN_HYPERCUBE_GENERATOR,
];

export default function Home() {
    const age = Math.floor(
        new Date().getTime() / 1000 / 60 / 60 / 24 / 365 -
            new Date(1999, 0, 9, 0, 0, 0, 0).getTime() /
                1000 /
                60 /
                60 /
                24 /
                365
    );
    const [metadata, setMetadata] = useState<Record<string, CombinedMetadata>>(
        {}
    );
    const [repoLanguages, setRepoLanguages] = useState<
        Record<string, Record<string, number>>
    >({});
    const [repoElements, setRepoElements] = useState<JSX.Element[]>(
        GITHUB_REPOS.map((repo) =>
            renderRepoElements(repo, metadata[repo], repoLanguages[repo])
        )
    );

    useEffect(() => {
        async function fetchGithubData() {
            const metadata: Record<string, CombinedMetadata> = {};
            const languages: Record<string, Record<string, number>> = {};
            const repoElements: JSX.Element[] = [];

            for (const repo of GITHUB_REPOS) {
                try {
                    metadata[repo] = await fetchMetadata(repo);
                    languages[repo] = await fetchLanguages(repo);
                } catch (e) {
                    console.error(`Failed to fetch data for ${repo}:`, e);
                }

                repoElements.push(
                    renderRepoElements(repo, metadata[repo], languages[repo])
                );
            }

            setMetadata(metadata);
            setRepoLanguages(languages);
            setRepoElements(
                repoElements.sort((a, b) => {
                    const aMeta = metadata[a.key as string];
                    const bMeta = metadata[b.key as string];
                    return (
                        new Date(bMeta.updated_at).getTime() -
                        new Date(aMeta.updated_at).getTime()
                    );
                })
            );
        }

        fetchGithubData();
    }, []);

    return (
        <div className="container">
            <header className="row center">
                <h1>Cameron Chrobocinski</h1>
            </header>
            <main className="row center" style={{ flexWrap: "wrap-reverse" }}>
                <section
                    className="column"
                    style={{ maxWidth: "700px", gap: "15px", width: "100%" }}
                >
                    <h2>About Me</h2>
                    <p>
                        Hello! My name is Cameron Chrobocinski and I am a junior
                        software engineer at USAA. I grew up in Corpus Christi,
                        Texas and graduated from Texas A&M University - Corpus
                        Christi with a Bachelor of Science in Computer Science.
                        I currently live in Bryan, Texas. I am {age} years old.
                        My wife, Mary, and my daughters, Amelia and Briar, are
                        my inspiration. My corgi, Gidget, has kept me company
                        since 2019. In my scant free time, I work on personal
                        coding projects, play video games, and play Tabletop
                        Roleplaying Games (e.g. Dungeons & Dragons). I learn
                        best through examples and hands-on experience. If
                        you&apos;d like to chat, please email me.
                    </p>
                    <h2>Projects</h2>
                    {repoElements}
                    <h3>
                        <a href="https://onlinegdb.com/S1gutYEsv">
                            Message Transfer Protocol
                        </a>
                    </h3>
                    <p>
                        This project was made as the final assignment for my
                        Systems Programming class during my Fall 2020 semester.
                        It&apos;s a program that accepts a binary message and
                        simulates sending the individual bytes over a network by
                        sending the bytes across 3 unique processes, sending
                        confirmation of receipt messages, and printing the
                        message once all bites have been transmitted.
                    </p>
                </section>
            </main>
        </div>
    );
}
