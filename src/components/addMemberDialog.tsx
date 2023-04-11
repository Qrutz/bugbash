import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { RxCross1 } from "react-icons/rx";
import type { Project, User } from "@prisma/client";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: projectProp["project"] | null;
}

type projectProp = {
  project: Project & {
    kanbanBoard: {
      id: string;
    } | null;
    members: User[] | null;
  };
};

type FormValues = {
  username: string;
};

export const AddMemberDialog = ({
  isOpen,
  onClose,
  project,
}: TaskDialogProps) => {
  const ctx = api.useContext();
  const { register: addMemberInput, handleSubmit } = useForm<FormValues>();
  const { mutate: addMember } =
    api.projectRouter.addMemberToProject.useMutation({
      onSuccess: () => {
        void ctx.projectRouter.getProject.invalidate();
      },

      onError: () => {
        console.log("error");
      },
    });

  if (project == null) {
    return <div></div>;
  }

  const { mutate: removeMember } =
    api.projectRouter.removeMemberFromProject.useMutation({
      onSuccess: () => {
        void ctx.projectRouter.getProject.invalidate();
      },
      onError: () => {
        console.log("error");
      },
    });

  const handleClose = () => {
    onClose();
  };

  const addMemberHandler: SubmitHandler<FormValues> = (data: {
    username: string;
  }) => {
    onClose();

    addMember({
      name: data.username,
      projectId: project.id,
    });
  };

  const handleRemoveMember = (MemberName: string) => {
    removeMember({
      name: MemberName,
      projectId: project.id,
    });
  };

  if (project == null) {
    return <div></div>;
  }

  const members =
    project.members !== null
      ? project.members.map((member: User) => (
          <form
            key={member.id}
            onSubmit={() => handleRemoveMember(member.name)}
            className="flex items-center justify-between border-b py-2"
          >
            <p>{member.name}</p>
            <button
              type="submit"
              className="ml-2  rounded px-2  py-0 font-bold text-gray-700 outline-none hover:bg-gray-300"
            >
              Remove
            </button>
          </form>
        ))
      : null;

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
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
        // initialFocus={null} :: add later
      >
        <div className="flex min-h-screen  items-center justify-center">
          <Dialog.Overlay className="z-3 fixed inset-0 bg-black opacity-30" />

          <div className="z-0 w-[35%] rounded-lg bg-white p-4 text-black ">
            <div className="flex items-center  justify-between border-b py-2">
              <h3 className=" text-lg font-medium">Share Project</h3>
              <button
                onClick={handleClose}
                className="ml-2  rounded px-2  py-0 font-bold text-gray-700 outline-none "
              >
                <RxCross1 className="text-center text-xl" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(addMemberHandler)}
              className="flex gap-1  py-2"
            >
              <input
                className="h-8 flex-[9]  border-4 "
                type="text"
                placeholder="Username"
                {...addMemberInput("username")}
              />
              <button
                type="submit"
                className="flex-[1] rounded px-2 py-0  font-bold text-gray-700 outline-none hover:bg-gray-300 active:outline-none"
              >
                Add
              </button>
            </form>
            {/* {project.members.map((member: any) => (
              <div className="flex items-center justify-between border-b py-2">
                <p>{member.username}</p>
                <button className="ml-2  rounded px-2  py-0 font-bold text-gray-700 outline-none hover:bg-gray-300">
                  Remove
                </button>
              </div>
            ))} */}
            <div className="py-2">{members}</div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
