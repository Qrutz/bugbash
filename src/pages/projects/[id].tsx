import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

import KanbanBoard from "~/components/KanbanBoard";
import { Tab } from "@headlessui/react";
import Breadcrumbs from "~/components/breadcrumbs";
import { BsPlus } from "react-icons/bs";
import { AddMemberDialog } from "~/components/addMemberDialog";
import Layout from "~/components/layout";
import { BiUserPlus } from "react-icons/bi";
import { useSession } from "next-auth/react";

export default function Project() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { id } = router.query as { id: string };
  const [open, setOpen] = React.useState(false);

  const { data: getProject, status: projectStatus } =
    api.projectRouter.getProject.useQuery(
      {
        id: id,
      },
      // only fetch if id is not undefined
      { enabled: id !== undefined && id !== "" && id !== "undefined" }
    );

  const { mutate: deleteProject } = api.projectRouter.deleteProject.useMutation(
    {
      onSuccess: () => {
        router.push("/projects").catch((err) => console.error(err));
      },

      onError: (err) => {
        alert("ONLY MR QRUTZ CAN DELETE PROJECTS SIRS");
      },
    }
  );

  const deleteProjectHandler = () => {
    deleteProject({
      id: id,
      userId: session?.user.id as string,
    });
  };

  const members = (
    <>
      {getProject?.members.map((member) => {
        return (
          <div
            className="-ml-2 rounded-full border border-gray-800"
            key={member.id}
          >
            <img
              className="h-11 w-11 rounded-full"
              src={member.image || undefined}
              alt=""
            />
          </div>
        );
      })}
    </>
  );

  const tabs = ["Kanban", "Schedule", "Settings"];

  return (
    <Layout>
      {projectStatus === "loading" ? (
        <main
          role="status"
          className=" status flex h-screen flex-[8] items-center justify-center"
        >
          <svg
            aria-hidden="true"
            className="mr-2 inline h-20 w-20 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </main>
      ) : (
        <main className=" flex flex-[8]  flex-col overflow-x-auto overflow-y-hidden to-gray-900 scrollbar   scrollbar-thumb-neutral-300  ">
          <header className="sticky left-0 right-0  px-4 py-8  ">
            <div className="flex justify-between">
              <Breadcrumbs
                items={[
                  {
                    label: "Projects",
                    path: "/projects",
                  },
                  {
                    label: getProject?.name,
                    path: `/projects/${getProject?.id || ""}`,
                  },
                ]}
              />
              <div className=" flex items-center justify-start ">
                {members}
                <div className="ml-2 cursor-pointer rounded-md border border-yellow-500">
                  <button
                    onClick={() => setOpen(true)}
                    className="mx-2 flex h-11 items-center gap-2 rounded-full bg-gray-900 py-1 text-xl  text-yellow-300"
                  >
                    <BiUserPlus className="h-6 w-6" />
                    <span className="">Invite</span>
                  </button>
                  {getProject?.members !== undefined ? (
                    <AddMemberDialog
                      isOpen={open}
                      onClose={() => setOpen(false)}
                      project={getProject}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <h1 className="my-4 text-5xl font-bold">{getProject?.name}</h1>
          </header>
          <Tab.Group>
            <Tab.List className="sticky left-0 right-0 flex w-full  gap-2  border-b-2 border-gray-800     ">
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `mx-4  py-2 text-lg font-medium text-white ${
                      selected ? "border-b border-yellow-300 " : " "
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className=" h-full min-w-full   ">
              <Tab.Panel className="h-full w-fit   px-4 py-6">
                {getProject?.kanbanBoard?.id ? (
                  <KanbanBoard
                    id={getProject.kanbanBoard.id}
                    projectId={getProject.id}
                  />
                ) : (
                  <div>NO KANBAN</div>
                )}
              </Tab.Panel>
              <Tab.Panel>schedule</Tab.Panel>
              <Tab.Panel className="flex h-full items-center  justify-center px-4">
                <button
                  onClick={deleteProjectHandler}
                  className="h-[5rem] w-[10%] justify-center bg-red-800"
                >
                  Delete project
                </button>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </main>
      )}
    </Layout>
  );
}
