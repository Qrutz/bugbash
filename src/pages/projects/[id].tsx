import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import {
  RxDashboard,
  RxCircle,
  RxCardStackPlus,
  RxAccessibility,
} from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { BiDotsVertical } from "react-icons/bi";
import { IconType } from "react-icons";

type KanbanColumnProps = {
  title: string;
  children: React.ReactNode;
  provided: any;
  innerRef: any;
};
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import KanbanBoard from "~/components/KanbanBoard";

function MenuTab(props: { name: string; icon: IconType }) {
  return (
    <span className="to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r">
      <span className="flex items-center gap-2 text-lg">
        <span className="text-xl"> {<props.icon />} </span>{" "}
        <h1>{props.name}</h1>
      </span>
      <span className="w-[10%] rounded-md bg-red-600 text-center">4</span>
    </span>
  );
}

export default function Project() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: getProject, status: projectStatus } =
    api.projectRouter.getProject.useQuery({
      id: id,
    });

  if (projectStatus === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto   shadow-sm shadow-black">
      <div className="flex ">
        <nav className="border-slate-00 h-screen flex-1 border-r bg-neutral-950">
          <div className="text-white-500 flex flex-col items-center justify-center gap-4 p-4">
            <MenuTab name="Dashboard" icon={RxDashboard} />
            <MenuTab name="Projects" icon={RxCircle} />
            <MenuTab name="My Tasks" icon={RxCardStackPlus} />
            <MenuTab name="Settings" icon={RxAccessibility} />
          </div>

          <div className="text-white-500 flex flex-col items-center justify-center gap-2 p-3">
            <span>Projects</span>
            <span>p1</span>
            <span>p2</span>
            <span>p3</span>
          </div>
        </nav>
        <main className="flex flex-[4] flex-col bg-neutral-950 p-3">
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
                onClick={() => console.log("todo")}
              >
                Add Member
              </button>
            </div>
          </div>
          <h1 className="my-4 text-4xl font-bold">{getProject?.name}</h1>
          <KanbanBoard id={"clg13ohf900029yzh0sp3ng54"} />
        </main>
      </div>
    </div>
  );
}
