import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function PostMarkdownPreview({ content }: { content: string }) {
  if (!content) {
    return <p className="text-muted-foreground italic">Önizlenecek içerik yok.</p>;
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-a:text-primary prose-img:rounded-lg prose-img:border prose-img:border-border/50 prose-pre:bg-background">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt ?? ""} className="my-4 w-full rounded-lg border border-border/50 object-cover" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
