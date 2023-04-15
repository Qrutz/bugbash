import { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { BiLabel, BiUser } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import React from "react";
import LabelDropdown from "./LabelDialog";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskName: string;
  initialTaskDescription: string;
  initialTaskLabels: {
    id: string;
    name: string;
    color: string;
  }[];
  taskID: string;
}

type FormValues = {
  name: string;
  description: string;
};

export const TaskDialog = ({
  isOpen,
  onClose,
  initialTaskName,
  initialTaskDescription,
  initialTaskLabels,
  taskID,
}: TaskDialogProps) => {
  const ctx = api.useContext();
  const { mutate: updateTask } = api.kanbanRouter.editTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data: {
    name: string;
    description: string;
  }) => {
    onClose();
    updateTask({
      taskId: taskID,
      name: data.name,
      description: data.description,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog
        as="div"
        className="z-10000 fixed inset-0 overflow-y-auto"
        onClose={onClose}
        // initialFocus={null} :: add later
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="z-3 fixed inset-0 bg-black opacity-30" />

          <div className="overflow-scroll-y z-0 w-[62.5%] rounded-lg bg-white  p-4  text-black">
            <div className="flex items-center justify-between ">
              <h3 className=" text-lg font-bold">Edit Task</h3>
              <button className="mb-3 cursor-pointer rounded-full p-1 hover:bg-gray-200">
                <RxCross1 className="text-2xl" onClick={handleClose} />
              </button>
            </div>
            <section className="flex gap-3 ">
              <div className=" flex-[9] space-y-4 py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600">labels</p>
                  <Menu>
                    <div className="flex flex-wrap gap-1">
                      {initialTaskLabels.map((label) => (
                        <span
                          key={label.id}
                          className={`rounded-md bg-${label.color}-500 font-extralight text-white hover:bg-${label.color}-600 `}
                        >
                          <button className="p-1 text-sm ">
                            {" "}
                            {label.name}
                          </button>
                        </span>
                      ))}
                      <LabelDropdown
                        labels={initialTaskLabels}
                        taskId={taskID}
                        logoOnly={true}
                      />
                    </div>
                  </Menu>
                </div>

                <main className="">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="mb-1 block text-lg font-semibold text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        placeholder="Task Name..."
                        className=" w-full border  border-gray-900 p-1 text-lg shadow-sm      "
                        defaultValue={initialTaskName}
                        {...register("name", { required: false })}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="mb-1 block text-lg  font-semibold  text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        defaultValue={initialTaskDescription}
                        rows={3}
                        placeholder="Task Description..."
                        className="w-full rounded-md border   border-neutral-800 p-2 text-lg shadow-sm   "
                        {...register("description", { required: false })}
                      ></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <h1 className="text-lg text-gray-800">Comments </h1>
                      </div>
                      <div className="flex w-full items-center space-x-1 ">
                        <span className="h-8 w-8 rounded-full bg-black" />{" "}
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className=" w-full rounded-md border   p-1 text-lg shadow-lg"
                        />
                      </div>

                      <div className="mt-4 flex w-full flex-col gap-2   space-x-1 ">
                        <div className="flex items-center gap-1">
                          {" "}
                          <span className="h-8 w-8 rounded-full bg-black" />{" "}
                          <h1>Qrutz</h1>
                          <p className="ml-2  text-xs "> an hour ago</p>
                        </div>
                        <span
                          className=" w-full rounded-md border  p-1
                          text-lg shadow-md"
                        >
                          This task is dogshit fr fr
                        </span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-transparent bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-purple-600"
                      >
                        Save Changes
                      </button>
                      <button
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:bg-gray-300"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </main>
              </div>

              <Menu>
                <nav className="flex-[2] flex-col space-y-2 py-3 ">
                  <h1 className="text-gray-500">Add to card</h1>
                  <span className="flex  cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300">
                    <button className="flex items-center gap-1 px-1 py-1">
                      <BiUser /> Members
                    </button>
                  </span>

                  <LabelDropdown taskId={taskID} labels={initialTaskLabels} />
                </nav>
              </Menu>
            </section>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
