import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Sidebarv2 } from "./SidebarV2";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex bg-gray-900  shadow-sm shadow-black">
      <Sidebarv2 setIsOpen={setIsOpen} isOpen={isOpen} />

      {children}
    </div>
  );
}
