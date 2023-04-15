import { useState } from "react";
import { Transition } from "@headlessui/react";
import { BiUser, BiUserPlus } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";

import { api } from "~/utils/api";
import { BsCheckLg } from "react-icons/bs";

type AddCardMemberDropdownProps = {
  logoOnly?: boolean;
  members?: {
    id: string;
    name: string;
    image: string | null;
  }[];

  taskID: string;
  projectId: string;
};

export default function AddCardMemberDropdown({
  logoOnly,
  members,
  taskID,
  projectId,
}: AddCardMemberDropdownProps) {
  const ctx = api.useContext();

  const [isOpen, setIsOpen] = useState(false);

  const { data: users, status } = api.kanbanRouter.getMembers.useQuery({
    projectId: projectId,
    taskId: taskID,
  });

  const { mutate: addMember } = api.kanbanRouter.assignMemberToTask.useMutation(
    {
      onSuccess: () => {
        void ctx.kanbanRouter.getColumns.invalidate();
        void ctx.kanbanRouter.getMembers.invalidate({ taskId: taskID });
      },
    }
  );

  const { mutate: removeMember } =
    api.kanbanRouter.unassignMemberFromTask.useMutation({
      onSuccess: () => {
        void ctx.kanbanRouter.getColumns.invalidate();
        void ctx.kanbanRouter.getMembers.invalidate({ taskId: taskID });
      },
    });

  const handleAddMember = (memberID: string) => {
    addMember({
      taskId: taskID,
      memberId: memberID,
    });
  };

  const handleRemoveMember = (memberID: string) => {
    removeMember({
      taskId: taskID,
      memberId: memberID,
    });
  };

  return (
    <div>
      <div className=" text-left">
        {logoOnly ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 rounded-md bg-gray-100 p-1 hover:bg-gray-200"
          >
            <BiUserPlus className=" text-2xl" />
          </button>
        ) : (
          <span
            onClick={() => setIsOpen(true)}
            className="flex  cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300"
          >
            <button className="flex items-center gap-1 px-1 py-1">
              <BiUser /> Members
            </button>
          </span>
        )}
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="z-1 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="flex w-full  border-b p-1">
              <span className="flex-[11] items-center text-center">
                {" "}
                Members{" "}
              </span>

              <span className="flex-1 cursor-pointer text-right">
                {" "}
                <RxCross1
                  className="text-xl"
                  onClick={() => setIsOpen(false)}
                />
              </span>
            </div>
            <div className="flex w-full flex-col gap-2  border-b   ">
              {users?.map((member) =>
                member.assigned ? (
                  <button
                    key={member.id}
                    onClick={() => handleRemoveMember(member.id)}
                    className="flex w-full items-center justify-between gap-1 p-2 hover:bg-gray-400"
                  >
                    <div className="flex gap-2">
                      <img
                        src={member.image || ""}
                        alt="user"
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{member.name}</span>
                    </div>

                    <BsCheckLg className="text-xl" />
                  </button>
                ) : (
                  <button
                    key={member.id}
                    onClick={() => handleAddMember(member.id)}
                    className="flex w-full items-center gap-1 p-2 hover:bg-gray-400"
                  >
                    <img
                      src={member.image || ""}
                      alt="user"
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{member.name}</span>
                    <span>{member.assigned}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
