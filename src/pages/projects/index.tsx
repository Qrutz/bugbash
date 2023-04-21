import { useSession } from "next-auth/react";
import Link from "next/link";
import router from "next/router";
import React from "react";
import CreateProjectDialog from "~/components/CreateProjectDialog";
import Breadcrumbs from "~/components/breadcrumbs";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

export default function Index() {
  const { data: session, status: sessionStatus } = useSession();
  const [isProjectCreateOpen, setIsProjectCreateOpen] = React.useState(false);

  const { data: projects, status: projectsStatus } =
    api.projectRouter.getAll.useQuery(
      {
        userId: session?.user.id as string,
      },
      { enabled: !!session }
    );

  if (sessionStatus === "loading") {
    return null;
  }

  if (!session) {
    router.push("/login").catch((err) => console.error(err));
  }

  return (
    <Layout>
      <main className="w-500rem 100px flex flex-[8] flex-col   ">
        <header className="sticky left-0 right-0  px-4 py-8  ">
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
          <h1 className="my-4 text-5xl font-bold">Projects</h1>
        </header>

        <div className="flex space-x-2 p-3">
          {projectsStatus === "loading" ? (
            <div>loading</div>
          ) : (
            <>
              {projects?.map((project) => (
                <Link
                  className="flex h-[5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-gray-800 hover:bg-gray-700"
                  href={`/projects/${project.id}`}
                  key={project.id}
                >
                  <span className="font-semibold">{project.name}</span>
                </Link>
              ))}
            </>
          )}

          <div
            onClick={() => setIsProjectCreateOpen(true)}
            className=" flex h-[5rem] cursor-pointer flex-col  items-center justify-center gap-2 rounded-md bg-purple-800 hover:bg-purple-900"
          >
            <span className=" font-semibold">Create new project</span>
            <CreateProjectDialog
              isOpen={isProjectCreateOpen}
              setIsOpen={setIsProjectCreateOpen}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
