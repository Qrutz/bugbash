import { Draggable } from "react-beautiful-dnd";

interface TaskProps {
  task: Task;
  index: number;
}

interface Task {
  id: string;
  name: string | null;
}

export const Task = ({ task, index }: TaskProps) => {
  const draggingStyle =
    "bg-neutral-800 animate-pulse text-neutral-100 min-h-[50px] rounded-md border border-neutral-700 p-2";
  const notDraggingStyle =
    "bg-neutral-800 text-neutral-100 min-h-[50px] rounded-md border border-neutral-700 p-2";
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? draggingStyle : notDraggingStyle}
        >
          {task.name}
        </div>
      )}
    </Draggable>
  );
};
