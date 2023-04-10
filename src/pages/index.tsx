import { type NextPage } from "next";
import Link from "next/link";
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

const Home: NextPage = () => {
  const { data: session, status: userstatus } = useSession();
  const router = useRouter();

  userstatus === "loading" ? <div>Loading...</div> : null;

  const { data } = api.projectRouter.getAll.useQuery({
    userId: session?.user.id as string,
  });

  // if (userstatus === "loading") {
  //   return <div>Loading...</div>;
  // }
  if (!session) {
    return (
      <div>
        <button onClick={() => void signIn()}>SIGN IN </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex   bg-slate-800">
      <nav className="border-slate-00 h-screen flex-1 border-r border-neutral-800 bg-neutral-950">
        <div className="text-white-500 flex flex-col items-center justify-center gap-4 p-4">
          <MenuTab name="Projects" icon={RxDashboard} />
          <MenuTab name="" icon={RxCircle} />
          <MenuTab name="My Tasks" icon={RxCardStackPlus} />
          <MenuTab name="Settings" icon={RxAccessibility} />
        </div>

        {/* <div className="text-white-500 flex flex-col items-center justify-center gap-2 p-3">
          <span>Projects</span>
          <span>p1</span>
          <span>p2</span>
          <span>p3</span>
        </div> */}
      </nav>

      <main className="flex flex-[5] flex-col items-center justify-center ">
        <h1>Welcome {session.user.name}</h1>
        <img src={session.user.image || ""} width={150} height={150} />

        <h2>Projects:</h2>

        {data?.map((project): ReactNode => {
          return (
            <div key={project.id}>
              <Link href={`/projects/${project.id}`}>{project.name}</Link>
            </div>
          );
        })}

        <button onClick={() => void signOut()}>Sign out</button>
        <button onClick={() => router.push("/projects")}>cc</button>
      </main>
    </div>
  );
};

export default Home;
