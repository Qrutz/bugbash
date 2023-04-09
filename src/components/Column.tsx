import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { RxPlus } from "react-icons/rx";

interface Column {
  id: string;
  name: string;
  cards: Task[];
}

interface Task {
  id: string;
  name: string | null;
  description: string | null;
}

interface ColumnProps {
  // dont know yet what type column is
  column: Column;
}

const Column = ({ column }: ColumnProps) => {
  const ctx = api.useContext();
  const { mutate: addTask } = api.kanbanRouter.createTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const { handleSubmit } = useForm();
  const onSubmit = () => {
    addTask({
      columnId: column.id,
      name: "title",
    });
  };

  return (
    <div className="w-[15rem] text-center ">
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
              {column.cards.map((task: Task, index: number) => {
                return <Task key={task.id} task={task} index={index} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="submit"
            className="flex  w-full items-center justify-center gap-2 bg-blue-800"
          >
            <RxPlus className="h-6 w-6" />
            <span>New Task</span>
          </button>
        </form>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="text-black"
            {...register("title", { required: true, maxLength: 20 })}
          />
          <button type="submit"> Add Task </button>
        </form> */}
      </div>
    </div>
  );
};

export default Column;
