import { Draggable } from "react-beautiful-dnd";

import { useState } from "react";
import { TaskDialog } from "./TaskDialog";

interface TaskProps {
  task: Task;
  index: number;
}

interface Task {
  id: string;
  name: string | null;
  description: string | null;
}

export const Task = ({ task, index }: TaskProps) => {
  const [isOpen, setIsOpen] = useState(false);

  //make sure task is not null
  if (!task) {
    return null;
  }

  const draggingStyle =
    "animate-pulse bg-neutral-800 text-neutral-100 min-h-[50px] rounded-md  bg-[#21222D] shadow-2xl    p-2";
  const notDraggingStyle =
    "bg-neutral-800 text-neutral-100 min-h-[50px] rounded-md bg-gray-800 shadow-2xl    p-2";
  return (
    <div onClick={() => setIsOpen(true)}>
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? draggingStyle : notDraggingStyle}
          >
            <h1 className="text-md font-semibold"> {task.name}</h1>
            <p className="text-sm text-gray-400"> {task.description}</p>
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
    </div>
  );
};
