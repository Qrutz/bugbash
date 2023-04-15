import { Draggable } from "react-beautiful-dnd";

import { useState } from "react";
import { TaskDialog } from "./TaskDialog";
import { type TaskInterface } from "./Column";

import { FaCommentAlt } from "react-icons/fa";

interface TaskProps {
  task: TaskInterface;
  index: number;
  projectId: string;
}

// interface Task {
//   id: string;
//   name: string | null;
//   description: string | null;
//   label
// }

export const Task = ({ task, index, projectId }: TaskProps) => {
  const [isOpen, setIsOpen] = useState(false);

  //make sure task is not null
  if (!task) {
    return null;
  }

  const draggingStyle =
    "animate-pulse  text-neutral-100 min-h-[50px] rounded-md  bg-[#21222D] shadow-2xl    p-2";
  const notDraggingStyle =
    " text-neutral-100 min-h-[50px] rounded-md bg-gray-800 shadow-2xl ";
  return (
    <>
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            onClick={() => setIsOpen(true)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? draggingStyle : notDraggingStyle}
          >
            <div className="space-y-1 px-3 py-2">
              <h1 className="text-lg font-bold"> {task.name}</h1>
              <p className="text-sm text-gray-400"> {task.description}</p>
              <div className="flex flex-wrap justify-start gap-1">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className={`rounded-md bg-${label.color}-500 px-1 text-xs text-gray-200`}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>

            <div className=" flex w-full  border-t border-gray-700 py-2">
              <div className="mx-2 flex w-full items-center justify-between">
                <span className="flex">
                  {task.assignees.map((assignee) => (
                    <img
                      key={assignee.id}
                      className="-ml-1 h-6 w-6 rounded-full first:ml-0"
                      src={assignee.image || "https://i.pravatar.cc/300"}
                      alt={assignee.name}
                    />
                  ))}
                </span>
                {/* <FaCommentAlt className="text-gray-400" /> */}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <TaskDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTaskName={task.name || ""}
        taskAssignees={task.assignees}
        initialTaskDescription={task.description || ""}
        initialTaskLabels={task.labels}
        projectId={projectId}
        taskID={task.id}
      />
    </>
  );
};
