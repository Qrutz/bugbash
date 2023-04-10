import { useSession } from "next-auth/react";
import router from "next/router";
import React from "react";
import {
  RxAccessibility,
  RxCardStackPlus,
  RxCircle,
  RxDashboard,
} from "react-icons/rx";
import MenuTab from "~/components/MenuTab";
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
      <nav className="border-slate-00 h-screen flex-1 border-r border-neutral-800 bg-neutral-950">
        <div className="text-white-500 flex flex-col items-center justify-center gap-4 p-4">
          <MenuTab name="Projects" icon={RxDashboard} />
          <MenuTab name="Something" icon={RxCircle} />
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
            <div className="flex space-x-1">
              <button
                className="rounded-md bg-gray-500 p-1"
                onClick={() => console.log("todo")}
              >
                Add Member
              </button>
            </div>
          </div>
          <h1 className="my-4 text-4xl font-bold">Projects</h1>
        </header>

        <h3>Projects:</h3>
        <div className="flex space-x-2">
          {projects?.map((project) => (
            <div
              onClick={() => router.push(`projects/${project.id}`)}
              key={project.id}
              className=" flex h-[5rem] cursor-pointer flex-col  items-center justify-center gap-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
            >
              <span>{project.name}</span>
            </div>
          ))}

          <div
            onClick={() => console.log("new project")}
            className=" flex h-[5rem] cursor-pointer flex-col  items-center justify-center gap-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
          >
            <span>Create new project</span>
          </div>
        </div>
      </main>
    </div>
  );
}
