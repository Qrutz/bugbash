import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskName: string;
  initialTaskDescription: string;
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

          <div className="z-0 w-[25%]  rounded-lg bg-white p-4 text-black">
            <h3 className="mb-4 text-lg font-bold">Edit Task</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-semibold text-gray-700"
                >
                  Title
                </label>
                <input
                  className="h-8 w-full  border border-gray-900 shadow-sm focus:border-neutral-800 focus:ring focus:ring-neutral-800 focus:ring-opacity-50 sm:text-sm"
                  defaultValue={initialTaskName}
                  {...register("name", { required: false })}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-semibold  text-gray-700"
                >
                  Description
                </label>
                <textarea
                  defaultValue={initialTaskDescription}
                  rows={3}
                  className="w-full border  border-neutral-800 text-lg shadow-sm focus:border-neutral-800  "
                  {...register("description", { required: false })}
                ></textarea>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600"
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
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
