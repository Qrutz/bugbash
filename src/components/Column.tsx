import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { RxCross2, RxPlus } from "react-icons/rx";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Popover } from "@headlessui/react";

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

  const { mutate: editColumnName, isLoading: colUpdating } =
    api.kanbanRouter.changeColumnName.useMutation({
      onSuccess: () => {
        void ctx.kanbanRouter.getColumns.invalidate();
      },
    });

  const { mutate: removeColumn } = api.kanbanRouter.deleteColumn.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const { handleSubmit, register } = useForm();

  const onSubmitNewTask = () => {
    addTask({
      columnId: column.id,
      name: "Click to set proper name & desc",
    });
  };

  const onSubmit = (data: any) => {
    editColumnName({
      columnId: column.id,
      name: data.name,
    });
    setIsEditingName(false);
  };

  const removeCol = () => {
    removeColumn({
      columnId: column.id,
    });
  };

  return (
    <div className="h-full w-[15rem] rounded  bg-neutral-900">
      <div
        key={column.id}
        className=" items-center justify-between rounded-t-full  bg-neutral-900 px-1 py-2"
      >
        {isEditingName ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-2"
          >
            <input
              defaultValue={column.name}
              {...register("name")}
              className="rounded-md bg-neutral-800 px-2 py-1"
            />
            <button
              type="submit"
              className="rounded-md bg-green-500 py-1 font-medium text-white transition-colors duration-200 hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditingName(false)}
              className="rounded-md bg-red-500 py-1 font-medium text-white transition-colors duration-200 hover:bg-red-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex justify-between px-2 py-1">
            <h3
              onClick={() => setIsEditingName(true)}
              className="ml-1 cursor-pointer text-center text-xl font-extrabold"
            >
              {" "}
              {!colUpdating ? <>{column.name}</> : <>"...."</>}
            </h3>

            <Popover>
              <Popover.Button className="cursor-pointer">
                <BsThreeDots />
              </Popover.Button>
              <Popover.Panel className="right-50 left-50 absolute z-0 w-80 rounded-md bg-neutral-900 py-2  shadow-lg">
                <div className="flex flex-col gap-2 px-2">
                  <span className="flex  items-center border-b py-1">
                    <h1 className="flex-[11] items-center text-center">
                      List Actions
                    </h1>
                    <Popover.Button className="flex-1 cursor-pointer items-center rounded px-2 py-1 text-center hover:bg-gray-700">
                      <RxCross2 />
                    </Popover.Button>
                  </span>

                  <Popover.Button
                    onClick={removeCol}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-700"
                  >
                    <span className="font-medium ">Delete</span>
                  </Popover.Button>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        )}
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
        <form className="w-full   p-2" onSubmit={handleSubmit(onSubmitNewTask)}>
          <button
            type="submit"
            className="my-2 flex w-full items-center justify-center    gap-2 rounded-md bg-neutral-800 py-1"
          >
            <RxPlus className="h-6 w-6" />
            <span className=" font-medium text-gray-500">Add Task</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Column;
