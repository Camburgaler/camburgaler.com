import { markdownToJsx } from "../markdownToJsx";

type Props = {
    content: string;
};

export default function MarkdownRenderer({ content }: Props) {
    return <div>{markdownToJsx(content)}</div>;
}
