import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/types/blog";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 1,
      }
    );

    const headingElements = headings.map((heading) =>
      document.getElementById(heading.id)
    );

    headingElements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-20 space-y-1">
      <h3 className="text-sm font-semibold mb-4 text-foreground">
        On This Page
      </h3>
      <ul className="space-y-2 border-l-2 border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                "block text-sm py-1 px-4 border-l-2 -ml-[2px] transition-colors text-left w-full",
                activeId === heading.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                heading.level === 2 && "pl-4",
                heading.level === 3 && "pl-6",
                heading.level === 4 && "pl-8",
                heading.level === 5 && "pl-10",
                heading.level === 6 && "pl-12"
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
