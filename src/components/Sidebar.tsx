import React from "react";
import { RxDashboard } from "react-icons/rx";
import { SiOpenbugbounty as SiOpenBounty } from "react-icons/si";
import MenuTab from "./MenuTab";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { RiCalendarFill, RiTeamFill } from "react-icons/ri";
import { SiTask } from "react-icons/si";
import { BsFillInboxFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";

export default function Sidebar() {
  const [isShowing, setIsShowing] = React.useState(false);
  const { data: session, status: userstatus } = useSession();
  const router = useRouter();

  const stylingForActiveTab = {
    className:
      "bg-purple-700 flex w-full cursor-pointer justify-between   rounded-md p-2 font-medium text-white",
  };
  const stylingForInactiveTab = {
    className:
      " hover:bg-purple-900 flex w-full cursor-pointer justify-between   rounded-md py-2 px-1 font-medium text-white ",
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
            className="mb-16 flex cursor-pointer items-center gap-2  hover:bg-[#121419]"
          >
            {/* <button onClick={() => setIsShowing(true)} /> */}
            <img
              className="h-16 w-16 rounded-full"
              src={session?.user.image as string}
              alt="user"
            />
            <span className="text-white-500 text-xl font-semibold">
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
    <nav className="sticky bottom-0 top-0 h-screen flex-1 overflow-hidden  border-r border-gray-800 bg-[#171820] to-[#111217] ">
      <div className="logo flex  items-center gap-1 border-b border-neutral-800 px-2 py-4">
        <SiOpenBounty className="cursor-pointer text-3xl text-neutral-200" />
        <span className="text-white-500 cursor-pointer text-xl  font-extrabold">
          Bug
          <span className=" font-semibold">Bash</span>
        </span>
      </div>
      <div className="text-white-500 flex h-full flex-col  justify-between  ">
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

        <UserCard />
      </div>
    </nav>
  );
}
