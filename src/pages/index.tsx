import { type NextPage } from "next";
import Link from "next/link";
import { SiOpenbugbounty as SiOpenBounty } from "react-icons/si";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import type { ReactNode } from "react";
import Image from "next/image";
import MenuTab from "~/components/MenuTab";
import {
  RxAccessibility,
  RxCardStackPlus,
  RxCircle,
  RxDashboard,
} from "react-icons/rx";
import { useRouter } from "next/router";

const Home: any = () => {
  const { data: session, status: userstatus } = useSession();
  const router = useRouter();

  if (userstatus === "loading" || !router.isReady) {
    return <div className="h-screen bg-black">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="z-20 rounded-lg bg-white p-8">
          <div className="logo flex items-center gap-1 border-b border-neutral-800 px-2 py-4 text-neutral-950">
            <SiOpenBounty className="text-3xl text-neutral-950" />
            <span className="text-white-500 text-xl  font-extrabold">
              Bug
              <span className="font-semibold">Bash</span>
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => void signIn()}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white"
            >
              Sign in with Discord
            </button>
            <button className="pointer-events-none rounded bg-green-500 px-4 py-2 font-bold text-white opacity-50">
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  router.push("/projects");
  return null;
};

export default Home;
