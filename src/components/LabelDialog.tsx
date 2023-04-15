import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  BiLabel,
  BiLeftArrowAlt,
  BiPlus,
  BiPlusCircle,
  BiTrash,
} from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { label } from "@prisma/client";
import { LabelForm } from "./labelForm";
import { api } from "~/utils/api";

type DropdownProps = {
  taskId: string;
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
  logoOnly?: boolean;
};

export default function LabelDropdown({
  labels,
  taskId,
  logoOnly,
}: DropdownProps) {
  const ctx = api.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);

  const handleNext = () => {
    if (page < 1) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const { mutate: removeLabel } =
    api.kanbanRouter.removeLabelFromTask.useMutation({
      onSuccess: () => {
        void ctx.kanbanRouter.getColumns.invalidate();
      },
    });

  const handleRemoveLabel = (labelID: string) => {
    removeLabel({
      taskId: taskId,
      labelId: labelID,
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
            <BiPlus className="text-xl" />
          </button>
        ) : (
          <span
            onClick={() => setIsOpen(true)}
            className="z-0  flex cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300"
          >
            <button className="flex items-center gap-1 px-1 py-1">
              <BiLabel /> Labels
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
          {page === 0 && (
            <div className="py-1">
              <div className="flex w-full  border-b p-1">
                <span className="flex-[11] items-center text-center">
                  {" "}
                  Labels{" "}
                </span>

                <span className="flex-1 cursor-pointer text-right">
                  {" "}
                  <RxCross1
                    className="text-xl"
                    onClick={() => setIsOpen(false)}
                  />
                </span>
              </div>
              {labels.map((label) => (
                <Menu.Item key={label.id}>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <span
                        className={`${
                          active ? "text-gray-900" : "text-gray-500 "
                        } flex  items-center gap-2`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full bg-${label.color}-500`}
                        />
                        {label.name}
                      </span>

                      <button
                        onClick={() => handleRemoveLabel(label.id)}
                        className=" cursor-pointer text-right"
                      >
                        <BiTrash className="text-xl" />
                      </button>
                    </div>
                  )}
                </Menu.Item>
              ))}

              <button
                onClick={handleNext}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-100 p-1 hover:bg-gray-200"
              >
                Create label
              </button>
            </div>
          )}

          {page === 1 && (
            <div className="py-1">
              <div className=" flex justify-between border-b p-1 text-right">
                <button onClick={handlePrev}>
                  <BiLeftArrowAlt className="text-2xl" />
                </button>
                <h1 className="text-md">Create label</h1>

                <button onClick={() => setIsOpen(false)}>
                  <RxCross1 className="text-xl" />
                </button>
              </div>
              <LabelForm taskId={taskId} />
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
}
