import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";

interface Column {
  id: string;
  name: string;
  kanbanBoardId: string;
  cards: Task[];
}

interface Task {
  id: string;
  name: string;
}

interface ColumnProps {
  // dont know yet what type column is
  column: any;
  index: unknown;
}

const Column = ({ column, index }: ColumnProps) => {
  return (
    <div className="w-[20%] text-center">
      <div
        key={column.id}
        className=" items-center justify-between bg-neutral-900 px-1 py-2"
      >
        <h3 className="text-xl font-extrabold">{column.name}</h3>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2"
            >
              {column.cards.map((task: Task, index: unknown) => {
                return <Task key={task.id} task={task} index={index} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
