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
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";

export default function Sidebar() {
  const [isShowing, setIsShowing] = React.useState(false);
  const { data: session, status: userstatus } = useSession();
  const router = useRouter();

  const stylingForActiveTab = {
    className:
      "to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 bg-gradient-to-r",
  };
  const stylingForInactiveTab = {
    className:
      "to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r",
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
            className="mb-16 flex cursor-pointer items-center gap-2  hover:bg-neutral-900"
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
              className="h-full w-full bg-red-700   hover:bg-red-600"
            >
              SIGN OUT
            </button>
            <button
              onClick={() => setIsShowing(false)}
              className="h-full w-full bg-neutral-950   hover:bg-neutral-900"
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
    <nav className="sticky bottom-0 top-0 h-screen flex-1 overflow-hidden  border-r border-neutral-800  bg-neutral-950 ">
      <div className="logo flex  items-center gap-1 border-b border-neutral-800 px-2 py-4">
        <SiOpenBounty className="cursor-pointer text-3xl text-neutral-200" />
        <span className="text-white-500 cursor-pointer text-xl  font-extrabold">
          Bug
          <span className=" font-semibold">Bash</span>
        </span>
      </div>
      <div className="text-white-500 flex h-full flex-col  justify-between  ">
        <section className="items-center space-y-1 p-2 ">
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
        </section>

        <UserCard />
      </div>
    </nav>
  );
}
