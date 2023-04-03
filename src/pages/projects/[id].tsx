import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

export default function Project() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: getProject, status: projectStatus } =
    api.projectRouter.getProject.useQuery({
      id: id,
    });

  const { data: getKanban, status: kanbanStatus } =
    api.projectRouter.getProjectKanban.useQuery({
      projectId: id,
    });

  const mutation = api.projectRouter.addMemberToProject.useMutation();

  const handleAddMember = async () => {
    await mutation.mutateAsync({
      projectId: id as string,
      userId: "1",
    });
  };

  if (projectStatus === "loading" || kanbanStatus === "loading") {
    return <div>Loading...</div>;
  }
  console.log(getKanban);

  return (
    <div className="container mx-auto bg-gray-800 shadow-sm shadow-black">
      <div className="flex ">
        <nav className="h-screen flex-1 border-r border-slate-700 bg-slate-900">
          <div className="text-white-500 flex flex-col items-center justify-center gap-2 p-3">
            <span>Dashboard</span>
            <span>Projects</span>
            <span>My Tasks</span>
            <span>Settings</span>
          </div>

          <div className="text-white-500 flex flex-col items-center justify-center gap-2 p-3">
            <span>Projects</span>
            <span>p1</span>
            <span>p2</span>
            <span>p3</span>
          </div>
        </nav>
        <main className="flex flex-[4] flex-col bg-slate-900 p-3">
          <div className="flex justify-between">
            <span>Projects / {getProject?.name} / Kanban </span>
            <div className="flex space-x-1">
              {getProject?.members.map((member) => {
                return (
                  <div className="rounded-full" key={member.id}>
                    <img
                      className="h-9 w-9 rounded-full"
                      src={member.image || undefined}
                      alt=""
                    />
                  </div>
                );
              })}
              <button
                className="rounded-md bg-gray-500 p-1"
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>
          </div>
          <h1 className="my-4 text-4xl font-bold">{getProject?.name}</h1>
          {getKanban?.map((kanban) => {
            return (
              <div className="flex space-x-3" key={kanban.id}>
                {kanban.columns.map((col) => {
                  return (
                    <div className="w-[25%] flex-col border" key={col.id}>
                      <span className=" p-2">{col.name}</span>
                      <div className="p-2">
                        {col.cards.map((task) => {
                          return (
                            <div
                              key={task.id}
                              className="my-2 flex w-auto flex-col overflow-hidden rounded-md border bg-slate-800 p-2"
                            >
                              <span className="text-bold text-xl">
                                {task.name}
                              </span>

                              <span className="text-gray-300">
                                {task.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
