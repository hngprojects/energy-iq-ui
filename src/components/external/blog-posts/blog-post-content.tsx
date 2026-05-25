"use client";

import { motion } from "motion/react";
import type { BlogPostContent, ContentBlock } from "@/types/blog";

const h2 = "mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl";
const h3 = "mb-3 text-lg font-semibold text-slate-100";
const p  = "text-md text-slate-80 leading-relaxed md:text-lg";
const ul = "text-md text-slate-80 list-disc space-y-1 pl-6 leading-relaxed md:text-lg";


function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className={h2}>{block.text}</h2>;

    case "h3":
      return <h3 className={h3}>{block.text}</h3>;

    case "p":
      return <p className={p}>{block.text}</p>;

    case "italic":
      return <p className="text-md text-slate-70 italic leading-relaxed md:text-lg">{block.text}</p>;

    case "closing":
      return <p className="text-slate-100 text-lg font-bold italic md:text-xl">{block.text}</p>;

    case "divider":
      return <div className="border-slate-30 my-10 border-t" />;

    case "ul":
      return (
        <ul className={ul}>
          {block.items.map((item, i) => {
            if (typeof item === "string") return <li key={i}>{item}</li>;
            return (
              <li key={i}>
                {item.text}
                {item.children && (
                  <ul className="mt-1 list-disc space-y-1 pl-6">
                    {item.children.map((child, j) => <li key={j}>{child}</li>)}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      );

    case "table":
      return (
        <div className="border-slate-30 overflow-hidden rounded-lg border">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-secondary text-white">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([col1, col2], i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-surface-50" : ""}>
                  <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{col1}</td>
                  <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{col2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "blockquote":
      return (
        <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
          {block.text}{" "}
          {block.citation && (
            <a
              href={block.citation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              {block.citation.label}
            </a>
          )}
        </blockquote>
      );

    case "card-grid":
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {block.cards.map(({ title, items, note, noteLink }) => (
            <div key={title} className="border-border bg-card ring-border rounded-xl border p-5 shadow-sm ring-1">
              <h3 className="text-slate-100 mb-3 font-bold">{title}</h3>
              <p className="text-slate-70 mb-2 text-sm">AI controls / optimises / manages:</p>
              <ul className="text-slate-80 list-disc space-y-1 pl-5 text-sm">
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {note && (
                <p className="text-slate-70 mt-3 text-xs italic">
                  {note}{" "}
                  {noteLink && (
                    <a href={noteLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors">
                      (IEA)
                    </a>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case "challenge-list":
      return (
        <div className="space-y-4">
          {block.items.map(({ title, desc }) => (
            <div key={title} className="border-slate-30 flex items-start gap-4 border-b pb-4 last:border-0">
              <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
              <div>
                <p className="text-slate-100 font-semibold">{title}</p>
                <p className="text-slate-80 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

interface BlogPostContentProps {
  content: BlogPostContent;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="space-y-20">
      {content.sections.map((section, sIndex) => (
        <section key={section.id} id={section.id} className="scroll-mt-32 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {section.blocks.map((block, bIndex) => (
              <Block key={`${sIndex}-${bIndex}`} block={block} />
            ))}
          </motion.div>
          {sIndex < content.sections.length - 1 && (
            <div className="border-slate-30 my-10 border-t" />
          )}
        </section>
      ))}
    </div>
  );
}
