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
    <div className="h-full w-[15rem] rounded  bg-neutral-900">
      <div
        key={column.id}
        className=" items-center justify-between rounded-t-full  bg-neutral-900 px-1 py-2"
      >
        <h3 className="text-center text-xl font-extrabold">{column.name}</h3>
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
        <form className="w-full   p-2" onSubmit={handleSubmit(onSubmit)}>
          <button
            type="submit"
            className="my-2 flex w-full items-center justify-center    gap-2 rounded-md bg-neutral-800 py-1"
          >
            <RxPlus className="h-6 w-6" />
            <span className=" font-medium text-gray-500">Add Task</span>
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
