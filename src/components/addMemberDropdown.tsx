import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiPlus, BiUser } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { label } from "@prisma/client";
import { LabelForm } from "./labelForm";
import { api } from "~/utils/api";

type AddCardMemberDropdownProps = {
  logoOnly?: boolean;
  members?: {
    id: string;
    name: string;
    image: string;
  }[];
};

export default function AddCardMemberDropdown({
  logoOnly,
}: AddCardMemberDropdownProps) {
  const ctx = api.useContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className=" text-left">
        {logoOnly ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 rounded-md bg-gray-100 p-1 hover:bg-gray-200"
          >
            <BiPlus className="text-xl" />
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
            <div className="flex w-full  border-b px-2 py-1 "></div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
