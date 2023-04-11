import Link from "next/link";
import React from "react";

// components/breadcrumbs/Breadcrumbs.ts
import type { ReactNode } from "react";
// defining the Props
export type CrumbItem = {
  label: ReactNode; // e.g., Python
  path: string; // e.g., /development/programming-languages/python
};
export type BreadcrumbsProps = {
  items: CrumbItem[];
};

// ...omitted for brevity
// components/breadcrumbs/Breadcrumbs.ts
// ...omitted for brevity
// components/breadcrumbs/Breadcrumbs.ts
const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="text-md flex items-start gap-2">
      {items.map((crumb, i) => {
        const isLastItem = i === items.length - 1;
        if (!isLastItem) {
          return (
            <React.Fragment key={i}>
              <Link href={crumb.path} className="text-zinc-400 hover:underline">
                {crumb.label}
              </Link>
              {/* separator */}
              <span> / </span>
            </React.Fragment>
          );
        } else {
          return (
            <span className="font-semibold text-yellow-300">
              {crumb.label}{" "}
            </span>
          );
        }
      })}
    </div>
  );
};
export default Breadcrumbs;
