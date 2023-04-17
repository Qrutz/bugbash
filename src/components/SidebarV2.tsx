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
import { signOut, useSession } from "next-auth/react";

type SidebarProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sidebarv2 = ({ children, isOpen, setIsOpen }: SidebarProps) => {
  const { data: session, status: userstatus } = useSession();
  const [isShowing, setIsShowing] = React.useState(false);
  const router = useRouter();

  const stylingForActiveTab = {
    className:
      "bg-gray-700/50 flex w-full cursor-pointer lg:justify-between justify-center   p-2   rounded-md  text-white",
  };
  const stylingForInactiveTab = {
    className:
      " hover:bg-gray-700/50 hover:shadow-lg  shadow-gray-500/50 flex w-full cursor-pointer lg:justify-between justify-center  rounded-md  p-2 text-white ",
  };
  const UserCard = () => {
    if (userstatus === "loading") {
      return <div>loading</div>;
    } else {
      return (
        <>
          <Transition
            show={!isShowing}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            onClick={() => setIsShowing(true)}
            className="mb-16 flex w-full cursor-pointer items-center justify-center gap-2 hover:bg-gray-700/20 md:justify-start"
          >
            {/* <button onClick={() => setIsShowing(true)} /> */}
            <img
              className="h-14 w-14 rounded-full md:h-16 md:w-16"
              src={session?.user.image as string}
              alt="user"
            />
            <span className="text-white-500 hidden text-xl font-semibold lg:block">
              {session?.user.name}
            </span>
          </Transition>

          <Transition
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            className="mb-16 flex h-16 flex-col items-center justify-center "
            show={isShowing}
          >
            <button
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="h-full w-full bg-red-600   hover:bg-red-700"
            >
              SIGN OUT
            </button>
            <button
              onClick={() => setIsShowing(false)}
              className="h-full w-full bg-gray-950   hover:bg-gray-900"
            >
              Abort
            </button>
          </Transition>
        </>

        /* <div className="mb-16 flex cursor-pointer items-center gap-2 rounded-md hover:bg-neutral-900">
              <img
                className="h-16 w-16 rounded-full"
                src={session?.user.image as string}
                alt="user"
              />
              <span className="text-white-500 text-xl font-semibold">
                {session?.user.name}
              </span>
            </div> */
      );
    }
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
        className="sticky bottom-0 top-0 h-screen flex-1   overflow-hidden  border-r border-gray-800 "
      >
        <div className="logo flex   items-center gap-1 border-b border-neutral-800 px-2 py-4">
          <div className="flex w-full items-center justify-between">
            <span className="flex ">
              <SiOpenBounty className="cursor-pointer text-3xl text-neutral-200" />
              <span className="text-white-500 hidden cursor-pointer text-sm font-extrabold md:text-lg  lg:block">
                Bug
                <span className=" font-semibold">Bash</span>
              </span>
            </span>
          </div>
          <button onClick={() => setIsOpen(false)}>
            {" "}
            <BsArrowBarLeft className="hidden text-2xl text-white lg:block" />{" "}
          </button>
        </div>

        <div className="text-white-500 flex h-full flex-col items-center justify-between md:items-stretch ">
          <section className="items-center space-y-5 py-2 lg:px-2 lg:py-4">
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
          <UserCard />
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
        className=" sticky bottom-0 top-0 flex h-screen w-[1%] cursor-pointer items-center justify-center border-r border-gray-700 bg-gray-900 hover:bg-gray-800"
      >
        <AiOutlineDoubleRight className="text-2xl text-white" />
      </Transition>
    </>
  );
};
