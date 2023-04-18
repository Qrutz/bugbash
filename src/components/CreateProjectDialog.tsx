import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import router from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

interface CreateProjectDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  title: string;
}

export default function CreateProjectDialog({
  isOpen,
  setIsOpen,
}: CreateProjectDialogProps) {
  const { data: session, status: sessionStatus } = useSession();

  const { register, handleSubmit } = useForm<FormValues>();

  const { mutate: createProject } = api.projectRouter.createProject.useMutation(
    {
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`).catch((err) => console.error(err));
      },
    }
  );

  const createProjectHandler: SubmitHandler<FormValues> = (data) => {
    createProject({
      name: data.title,
      userId: session?.user.id as string,
    });
  };

  return (
    <Transition show={isOpen}>
      <Dialog
        onClose={() => setIsOpen(false)}
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <form
          onSubmit={handleSubmit(createProjectHandler)}
          className="flex min-h-screen items-center justify-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <div className="z-[10000] w-[60%] rounded-lg bg-white  px-16 py-8 shadow-lg">
            <Dialog.Title
              as="h3"
              className="py-4 text-3xl font-medium leading-6 text-gray-900"
            >
              Create Project
            </Dialog.Title>
            <div className="flex flex-col py-4">
              <span className=" flex items-center gap-4 py-2 text-black">
                <h2 className=" -ml-8 rounded-full bg-purple-600 px-4 py-2">
                  1
                </h2>
                <h2 className="text-lg font-bold">Project title</h2>
              </span>
              <input
                {...register("title")}
                placeholder="Project x "
                className="h-14 w-full rounded-lg border border-gray-400 px-4 py-2 text-black focus:border-purple-500 focus:outline-none"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-green-600 p-2 text-black "
            >
              Create
            </button>
          </div>
        </form>
      </Dialog>
    </Transition>
  );
}
