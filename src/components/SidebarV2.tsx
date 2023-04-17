import { Transition } from "@headlessui/react";
import Link from "next/link";
import { SiOpenbugbounty as SiOpenBounty } from "react-icons/si";
import MenuTab from "./MenuTab";
import { useRouter } from "next/router";
import { RxDashboard } from "react-icons/rx";
import React from "react";

import { RiCalendarFill, RiTeamFill } from "react-icons/ri";
import { SiTask } from "react-icons/si";
import { BsArrowBarLeft, BsFillInboxFill } from "react-icons/bs";
import { AiFillSetting, AiOutlineDoubleRight } from "react-icons/ai";

type SidebarProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sidebarv2 = ({ children, isOpen, setIsOpen }: SidebarProps) => {
  const router = useRouter();

  const stylingForActiveTab = {
    className:
      "bg-gray-800  flex w-full cursor-pointer justify-between   rounded-md p-2 font-medium text-white",
  };
  const stylingForInactiveTab = {
    className:
      " hover:bg-gray-800 flex w-full cursor-pointer justify-between   rounded-md py-2 px-1 font-medium text-white ",
  };

  return (
    <>
      <Transition
        show={isOpen}
        as="nav"
        enter="transition ease-out duration-100 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-100 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className="sticky bottom-0 top-0 h-screen flex-1  overflow-hidden  border-r border-gray-800 "
      >
        <div className="logo flex  items-center gap-1 border-b border-neutral-800 px-2 py-4">
          <div className="flex w-full justify-between ">
            <span className="flex ">
              <SiOpenBounty className="cursor-pointer text-3xl text-neutral-200" />
              <span className="text-white-500 cursor-pointer text-sm font-extrabold  md:text-2xl">
                Bug
                <span className=" font-semibold">Bash</span>
              </span>
            </span>
          </div>
          <button onClick={() => setIsOpen(false)}>
            {" "}
            <BsArrowBarLeft className="text-2xl text-white" />{" "}
          </button>
        </div>

        <div className="text-white-500 flex h-full flex-col  justify-between">
          <section className="items-center space-y-4 px-3 py-3 ">
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

                name="Projects"
                icon={RxDashboard}
              />
            </Link>

            <Link
              className={
                router.pathname.includes("/Schedule")
                  ? stylingForActiveTab.className
                  : stylingForInactiveTab.className
              }
              href="/Schedule"
            >
              <MenuTab name="Schedule" icon={RiCalendarFill} />
            </Link>
            <Link
              href="/Tasks"
              className={
                router.pathname.includes("/Tasks")
                  ? stylingForActiveTab.className
                  : stylingForInactiveTab.className
              }
            >
              <MenuTab name="Task List" icon={SiTask} />
            </Link>
            <Link
              href="/Inbox"
              className={
                router.pathname.includes("/Inbox")
                  ? stylingForActiveTab.className
                  : stylingForInactiveTab.className
              }
            >
              <MenuTab name="Inbox" icon={BsFillInboxFill} />
            </Link>
            <Link
              href="/Teams"
              className={
                router.pathname.includes("/Teams")
                  ? stylingForActiveTab.className
                  : stylingForInactiveTab.className
              }
            >
              <MenuTab name="Teams" icon={RiTeamFill} />
            </Link>
            <Link
              href="/Settings"
              className={
                router.pathname.includes("/Settings")
                  ? stylingForActiveTab.className
                  : stylingForInactiveTab.className
              }
            >
              <MenuTab name="Settings" icon={AiFillSetting} />
            </Link>
          </section>
        </div>
      </Transition>
      <Transition
        as="nav"
        show={!isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-100 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        onClick={() => setIsOpen(true)}
        className=" flex h-screen w-[1%] cursor-pointer items-center justify-center border-r border-gray-700 bg-gray-900 hover:bg-gray-800"
      >
        <AiOutlineDoubleRight className="text-2xl text-white" />
      </Transition>
    </>
  );
};
