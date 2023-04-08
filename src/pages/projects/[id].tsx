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

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  children,
  innerRef,
  provided,
}) => {
  return (
    <div className="flex w-[30%] flex-col overflow-hidden rounded-lg bg-stone-900 ">
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-extrabold ">{title}</h2>
        <div className="flex items-center space-x-2 text-xl">
          <button className="  hover:text-gray-800 focus:outline-none">
            <GoPlus />
          </button>

          <button className="text-2xl   hover:text-gray-800 focus:outline-none">
            <BiDotsVertical />
          </button>
        </div>
      </div>

      <div
        ref={innerRef}
        {...provided.droppableProps}
        className="flex-1 space-y-4 overflow-y-auto p-4"
      >
        {children}
      </div>
    </div>
  );
};

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
  const [count, setCount] = React.useState(0);

  const { data: getProject, status: projectStatus } =
    api.projectRouter.getProject.useQuery({
      id: id,
    });

  const { data: getKanban, status: kanbanStatus } =
    api.projectRouter.getProjectKanban.useQuery({
      projectId: id,
    });

  const mutation = api.projectRouter.addMemberToProject.useMutation();

  const moveTask = api.projectRouter.moveTask.useMutation();

  const handleMoveTask = async (
    projectId: string,
    taskId: string,
    columnId: string
  ) => {
    await moveTask.mutateAsync({
      projectId,
      taskId,
      columnId,
    });
  };

  const handleAddMember = async () => {
    await mutation.mutateAsync({
      projectId: id as string,
      userId: "1",
    });
  };

  if (projectStatus === "loading" || kanbanStatus === "loading") {
    return <div>Loading...</div>;
  }

  const handleDragEnd = (result: {
    destination: any;
    source: any;
    draggableId: any;
  }) => {
    const { destination, source, draggableId } = result;

    handleMoveTask(id, draggableId, destination.droppableId);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                      <Droppable droppableId="board">
                        {(provided) => (
                          <KanbanColumn
                            title={col.name}
                            key={col.id}
                            provided={provided}
                            innerRef={provided.innerRef}
                          >
                            {col.cards.map((task) => {
                              return (
                                <Draggable draggableId={task.id} index={count}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center justify-between rounded-md bg-stone-800 p-2"
                                    >
                                      <span>{task.name}</span>
                                      <span>{task.description}</span>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          </KanbanColumn>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              );
            })}
          </main>
        </div>
      </div>
    </DragDropContext>
  );
}
