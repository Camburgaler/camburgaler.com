// lib/markdownToJSX.tsx
import React, { createElement, Fragment, JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Optional: Customize components
const components: Record<string, React.ElementType> = {
    a: (props: any) => (
        <a {...props} target="_blank" rel="noopener noreferrer" />
    ),
};

export function markdownToJsx(markdown: string): JSX.Element {
    return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeReact, {
            createElement,
            Fragment,
            components,
            jsx,
            jsxs,
        })
        .processSync(markdown).result as JSX.Element;
}
