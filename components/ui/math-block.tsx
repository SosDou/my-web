import katex from "katex";

type MathBlockProps = {
    children: string;
};

export function MathBlock({ children }: MathBlockProps) {
    const html = katex.renderToString(children, {
        displayMode: true,
        output: "htmlAndMathml",
        throwOnError: false,
        trust: false,
    });

    return (
        <div
            className="max-w-full overflow-x-auto py-2"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
