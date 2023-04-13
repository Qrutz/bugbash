import { Draggable } from "react-beautiful-dnd";

import { useState } from "react";
import { TaskDialog } from "./TaskDialog";
import { TaskInterface } from "./Column";

interface TaskProps {
  task: TaskInterface;
  index: number;
}

// interface Task {
//   id: string;
//   name: string | null;
//   description: string | null;
//   label
// }

export const Task = ({ task, index }: TaskProps) => {
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
              <div className="space-x-1">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className={`rounded-md bg-gray-700 px-1 text-xs text-gray-400`}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex border-t border-gray-700 py-2">
              <span className="mx-2 flex w-full justify-between">
                <p>members</p>
                <p>comms</p>
              </span>
            </div>
          </div>
        )}
      </Draggable>

      <TaskDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTaskName={task.name || ""}
        initialTaskDescription={task.description || ""}
        taskID={task.id}
      />
    </>
  );
};
