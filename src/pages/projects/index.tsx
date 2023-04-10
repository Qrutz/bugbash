import { useSession } from "next-auth/react";
import Link from "next/link";
import router from "next/router";
import React from "react";
import {
  RxAccessibility,
  RxCardStackPlus,
  RxCircle,
  RxDashboard,
} from "react-icons/rx";
import MenuTab from "~/components/MenuTab";
import Sidebar from "~/components/Sidebar";
import Breadcrumbs from "~/components/breadcrumbs";
import { api } from "~/utils/api";

export default function index() {
  const { data: session, status: sessionStatus } = useSession();

  const { data: projects, status: projectsStatus } =
    api.projectRouter.getAll.useQuery(
      {
        userId: session?.user.id as string,
      },
      { enabled: !!session }
    );

  if (sessionStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
  }

  if (projectsStatus === "loading") {
    return <div>Loading...</div>;
  }
  {
    projects?.map((project) => console.log(project));
  }

  return (
    <div className=" flex overflow-auto shadow-sm shadow-black">
      <Sidebar />
      <main className="w-500rem 100px flex flex-[7] flex-col overflow-auto bg-neutral-950  ">
        <header className="sticky left-0 right-0  p-3  ">
          <div className="flex justify-between">
            <Breadcrumbs
              items={[
                {
                  label: "Projects",
                  path: "/projects",
                },
              ]}
            />
          </div>
          <h1 className="my-4 text-4xl font-bold">Projects</h1>
        </header>

        <div className="flex space-x-2">
          {projects?.map((project) => (
            <Link
              className="flex h-[5rem] cursor-pointer flex-col  items-center justify-center gap-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
              href={`/projects/${project.id}`}
              key={project.id}
            >
              <span className="font-semibold">{project.name}</span>
            </Link>
          ))}

          <div
            onClick={() => console.log("new project")}
            className=" flex h-[5rem] cursor-pointer flex-col  items-center justify-center gap-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
          >
            <span className=" font-semibold">Create new project</span>
          </div>
        </div>
      </main>
    </div>
  );
}
