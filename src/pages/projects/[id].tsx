import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

import KanbanBoard from "~/components/KanbanBoard";
import { Tab } from "@headlessui/react";
import MenuTab from "~/components/MenuTab";
import Breadcrumbs from "~/components/breadcrumbs";
import Sidebar from "~/components/Sidebar";
import { RxPlus } from "react-icons/rx";
import { BsPlus } from "react-icons/bs";
import { AddMemberDialog } from "~/components/addMemberDialog";

export default function Project() {
  const router = useRouter();
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

  if (!router.isReady) {
    return <div className="h-screen bg-black">hello</div>;
  }

  const members =
    projectStatus === "loading" ? (
      <div>loading</div>
    ) : (
      <>
        {getProject?.members.map((member) => {
          return (
            <div
              className="-ml-2 rounded-full border border-gray-800"
              key={member.id}
            >
              <img
                className="h-12 w-12 rounded-full"
                src={member.image || undefined}
                alt=""
              />
            </div>
          );
        })}
      </>
    );

  if (!router.isReady) {
    return null;
  }

  const tabs = ["Kanban", "Schedule"];

  return (
    <div className=" flex   shadow-sm shadow-black">
      <Sidebar />
      <main className="w-500rem 100px flex flex-[7] flex-col overflow-x-auto overflow-y-hidden bg-neutral-950 scrollbar    scrollbar-thumb-neutral-300  ">
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
                  path: `/projects/${getProject?.id}`,
                },
              ]}
            />
            <div className=" flex items-center justify-start ">
              {members}
              <div className="-ml-2 cursor-pointer rounded-full border border-gray-800">
                <BsPlus
                  onClick={() => setOpen(true)}
                  className="h-12 w-12 rounded-full bg-neutral-900 text-lg"
                />
                <AddMemberDialog
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  project={getProject!!}
                />
              </div>
            </div>
          </div>
          <h1 className="my-4 text-5xl font-bold">{getProject?.name}</h1>
        </header>
        <Tab.Group>
          <Tab.List className="sticky left-0 right-0 flex w-[15%] space-x-2    ">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `mx-4 w-full py-2 text-lg font-medium text-white ${
                    selected ? "border-b border-white " : " "
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className=" h-full w-full  ">
            <Tab.Panel className="h-full w-fit border-t border-neutral-800  px-4 py-6">
              {getProject?.kanbanBoard?.id ? (
                <KanbanBoard id={getProject.kanbanBoard.id} />
              ) : (
                <div>Create a kanban</div>
              )}
            </Tab.Panel>
            <Tab.Panel>schedule</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}
