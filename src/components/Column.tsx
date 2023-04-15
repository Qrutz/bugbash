import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { RxCross2, RxPlus } from "react-icons/rx";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Popover, Transition } from "@headlessui/react";
import React from "react";

interface Column {
  id: string;
  name: string;
  cards: TaskInterface[];
}

export interface TaskInterface {
  id: string;
  name: string | null;
  description: string | null;
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
  assignees: {
    id: string;
    name: string;
    image: string | null;
  }[];
}

interface ColumnProps {
  // dont know yet what type column is
  column: Column;
  projectId: string;
}

type FormValues = {
  name: string;
};

const Column = ({ column, projectId }: ColumnProps) => {
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
  const { handleSubmit, register } = useForm<FormValues>();

  const onSubmitNewTask = () => {
    addTask({
      columnId: column.id,
      name: "click to edit",
    });
  };

  const onSubmit: SubmitHandler<FormValues> = (data: { name: string }) => {
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
    <div
      key={column.id}
      className=" h-full w-[15rem] items-center justify-between space-y-2 rounded    px-1  py-2"
    >
      {isEditingName ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-2"
        >
          <input
            defaultValue={column.name}
            {...register("name")}
            className="rounded-md bg-gray-800 px-2 py-1"
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
        // bg-[#1d1e27]
        <div className="  flex justify-between rounded-lg bg-gray-800 px-2 py-2 text-zinc-200  ">
          <h3
            onClick={() => setIsEditingName(true)}
            className="ml-1 cursor-pointer text-center text-xl font-extrabold"
          >
            {!colUpdating ? <>{column.name}</> : <>...</>}
          </h3>

          <div className="  absolute relative right-0  top-[10px] ">
            <Menu>
              <Menu.Button className=" flex w-8 cursor-pointer  justify-center focus:outline-none">
                <BsThreeDots />
              </Menu.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className=" z-1 absolute left-0 right-3  w-60 rounded-md bg-white py-2 text-black  shadow-lg">
                  <div className="flex flex-col gap-2 px-2">
                    <span className="flex  items-center border-b border-zinc-800 py-1">
                      <h1 className="flex-[11] items-center text-center">
                        List Actions
                      </h1>
                      <Menu.Button className="flex-1 cursor-pointer items-center rounded px-2 py-1 text-center hover:bg-gray-300">
                        <RxCross2 />
                      </Menu.Button>
                    </span>

                    <Menu.Item as={React.Fragment}>
                      {({ active }) => (
                        <button
                          onClick={removeCol}
                          className="  gap-2 rounded-md px-2 py-1 hover:bg-gray-300"
                        >
                          <span className="text-start ">Delete List</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      )}
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex h-full w-full flex-col gap-4 overflow-y-auto "
          >
            {column.cards.map((task: TaskInterface, index: number) => {
              return (
                <Task
                  projectId={projectId}
                  key={task.id}
                  task={task}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <form
        className="w-full  py-1   "
        onSubmit={handleSubmit(onSubmitNewTask)}
      >
        <button
          type="submit"
          className="my-0 flex w-full items-center justify-center gap-2 rounded-md bg-[#1e1e29] py-1     text-gray-600 hover:bg-gray-800 hover:text-white"
        >
          <RxPlus className="text-2xl font-bold  " />
          <span className=" font-medium ">Add Task</span>
        </button>
      </form>
    </div>
  );
};

export default Column;
