import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { BiLeftArrowAlt } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import React from "react";

type LabelFormValues = {
  name: string;
  color: string;
};

interface CreateLabelDialogProps {
  taskId: string;
  isShowingProp: boolean;
  closedDialog: () => void;
  handleLeftArrowCLick?: () => void;
}

export const CreateLabelDialog = ({
  taskId,
  isShowingProp,
  closedDialog,
  handleLeftArrowCLick,
}: CreateLabelDialogProps) => {
  const ctx = api.useContext();
  const { mutate: addLabel } = api.kanbanRouter.addLabelToTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const {
    register: labelRegister,
    handleSubmit: labelSubmit,
    watch,
  } = useForm<LabelFormValues>();

  const handleLabelSubmit: SubmitHandler<LabelFormValues> = (data) => {
    addLabel({
      taskId: taskId,
      labelName: data.name,
      labelColor: data.color,
    });

    closedDialog();
  };

  return (
    <Transition show={isShowingProp} as={Fragment}>
      <Menu.Items
        static
        className="  z-10 mt-2 w-56 gap-2 rounded-md  bg-gray-100  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="-mx-4  flex justify-around border-b py-2 ">
          <button onClick={handleLeftArrowCLick}>
            <BiLeftArrowAlt className="text-2xl" />
          </button>
          <h1 className="text-md">Create label</h1>
          <Menu.Item>
            <button onClick={closedDialog}>
              <RxCross1 className="text-2xl" />
            </button>
          </Menu.Item>
        </div>
        <form onSubmit={labelSubmit(handleLabelSubmit)}>
          <div className="flex flex-col  gap-2 p-2">
            <label htmlFor="name" className="text-md">
              Title
            </label>
            <input
              {...labelRegister("name")}
              type="text"
              className="border border-gray-900 p-1"
            />
          </div>
          <div className=" flex flex-col gap-2 border-b p-2">
            <label htmlFor="name" className="text-md">
              Select a color
            </label>

            <div className="flex flex-wrap justify-evenly gap-2">
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "blue" ? "border-2 border-black" : null
                } bg-blue-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="blue"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "yellow" ? "border-2 border-black" : null
                } bg-yellow-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="yellow"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "green" ? "border-2 border-black" : null
                } bg-green-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="green"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "red" ? "border-2 border-black" : null
                } bg-red-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="red"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "indigo" ? "border-2 border-black" : null
                } bg-indigo-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="indigo"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "purple" ? "border-2 border-black" : null
                } bg-purple-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="purple"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "pink" ? "border-2 border-black" : null
                } bg-pink-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="pink"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "gray" ? "border-2 border-black" : null
                } bg-gray-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="gray"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "lime" ? "border-2 border-black" : null
                } bg-lime-500`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="lime"
                  className="hidden"
                />
              </label>
              <label
                className={`h-6 w-6 cursor-pointer rounded-full ${
                  watch("color") == "black" ? "border-2 border-white" : null
                } bg-black`}
              >
                <input
                  {...labelRegister("color")}
                  type="radio"
                  name="color"
                  value="black"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="p-2">
            <span className="items-center   p-2">
              <button type="submit" className="rounded-lg bg-purple-500 p-2">
                Create
              </button>
            </span>
          </div>
        </form>
      </Menu.Items>
    </Transition>
  );
};
