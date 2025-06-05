"use client";

import yaml from "js-yaml";
import { useState } from "react";
const languageColors = yaml.load(
    await fetch(
        "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
    ).then((res) => res.text())
) as Record<string, { color: string }>;

export default function LanguagesDisplay(props: {
    repoLanguages: Record<string, number>;
}) {
    const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

    function renderLanguageSpans() {
        return (
            <div style={{ width: "100%", display: "flex", height: "20px" }}>
                {Object.entries(props.repoLanguages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, count]) => (
                        <div
                            key={lang}
                            style={{
                                width: `${
                                    (count /
                                        Object.values(
                                            props.repoLanguages
                                        ).reduce((a, b) => a + b, 0)) *
                                    100
                                }%`,
                                backgroundColor: languageColors[lang].color,
                                borderRadius: "10px",
                                height: "100%",
                                fontSize: "1rem",
                            }}
                            onMouseEnter={() => setHoveredLanguage(lang)}
                            onMouseLeave={() => setHoveredLanguage(null)}
                        >
                            {hoveredLanguage === lang && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginBottom: "6px",
                                        padding: "6px 10px",
                                        backgroundColor: "#333",
                                        color: "#fff",
                                        whiteSpace: "nowrap",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        zIndex: "1000",
                                        opacity: "0.95",
                                        pointerEvents: "none",
                                        transition: "opacity 0.2s ease-in-out",
                                    }}
                                >
                                    {`${lang}: ${count}`}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        );
    }

    return props.repoLanguages && languageColors
        ? renderLanguageSpans()
        : `(languages loading...)`;
}
