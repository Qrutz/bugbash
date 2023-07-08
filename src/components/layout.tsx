import React, { useState } from "react";
import { Sidebarv2 } from "./SidebarV2";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex  bg-gray-900  shadow-sm shadow-black  ">
      <Sidebarv2 setIsOpen={setIsOpen} isOpen={isOpen} />
      <main className="flex flex-[8] flex-col overflow-auto scrollbar-thumb-neutral-300 ">
        {children}
      </main>
    </div>
  );
}
