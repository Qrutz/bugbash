import React from "react";
import {
  RxDashboard,
  RxCircle,
  RxCardStackPlus,
  RxAccessibility,
} from "react-icons/rx";
import { SiOpenbugbounty as SiOpenBounty } from "react-icons/si";
import MenuTab from "./MenuTab";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();

  const stylingForActiveTab = {
    className:
      "to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 bg-gradient-to-r",
  };
  const stylingForInactiveTab = {
    className:
      "to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r",
  };

  return (
    <nav className="border-slate-00 h-screen flex-1 border-r border-neutral-800 bg-neutral-950">
      <div className="logo flex items-center gap-1 border-b border-neutral-800 px-2 py-4">
        <SiOpenBounty className="text-3xl text-neutral-200" />
        <span className="text-white-500 text-xl  font-extrabold">
          Bug
          <span className="font-semibold">Bash</span>
        </span>
      </div>
      <div className="text-white-500 flex flex-col items-center justify-center gap-4 p-4">
        <Link
          className={
            router.pathname.includes("/projects")
              ? stylingForActiveTab.className
              : stylingForInactiveTab.className
          }
          href="/projects"
        >
          <MenuTab
            // if path is projects/everything after /projects/ then make the text red
            className={
              router.pathname.includes("/projects") ? "text-red-500" : ""
            }
            name="Projects"
            icon={RxDashboard}
          />
        </Link>
        <Link
          className="to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r"
          href="/projects"
        >
          <MenuTab name="Something" icon={RxCircle} />
        </Link>
        <Link
          href="/projects"
          className="to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r"
        >
          <MenuTab name="My Tasks" icon={RxCardStackPlus} />
        </Link>
        <Link
          href="/projects"
          className="to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r"
        >
          <MenuTab name="Settings" icon={RxAccessibility} />
        </Link>
      </div>

      {/* <div className="text-white-500 flex flex-col items-center justify-center gap-2 p-3">
    <span>Projects</span>
    <span>p1</span>
    <span>p2</span>
    <span>p3</span>
  </div> */}
    </nav>
  );
}
